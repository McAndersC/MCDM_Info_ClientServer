const express = require('express');
const path = require('path');
const expressServer = express();
const cors = require('cors');
const fetch = require('node-fetch');
const dotenv = require('dotenv');

dotenv.config();

expressServer.use(cors());
expressServer.use(express.static('client'));
expressServer.use(express.json());
expressServer.use(express.urlencoded({
    extended : true
}));

const { networkInterfaces } = require('os');
const helpers = require('./helpers');

const nets = networkInterfaces();
const results = Object.create(null); // Or just '{}', an empty object

for (const name of Object.keys(nets)) {
    for (const net of nets[name]) {
        // Skip over non-IPv4 and internal (i.e. 127.0.0.1) addresses
        // 'IPv4' is in Node <= 17, from 18 it's a number 4 or 6
        const familyV4Value = typeof net.family === 'string' ? 'IPv4' : 4
        if (net.family === familyV4Value && !net.internal) {
            if (!results[name]) {
                results[name] = [];
            }
            results[name].push(net.address);
        }
    }
}

// Client Endpoint
expressServer.get('/', (req, res) => {

    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.sendFile(path.resolve(__dirname, '../client/index.html'));

});

expressServer.get('/open', (req, res) => {


    const port = process.env.PORT;
    helpers.setPlatform(process.platform);

    if(helpers.getPlatform() === 'win32') {

        helpers.startWinCrome(port);

    } else if (helpers.getPlatform() === 'darwin') {

        helpers.startMacCrome(port);

    } else if (helpers.getPlatform() === 'linux') {

        helpers.startPiLinux(port);
    }

    res.setHeader('Content-Type', 'application/json');
    res.status(200);
    res.send({'message' : 'Attempt to start browser in kiosk mode.'});
});

expressServer.get('/kill', (req, res) => {


    if(helpers.getPlatform() === 'win32') {

        helpers.killChromeExe();

    } else if (helpers.getPlatform() === 'darwin') {

        helpers.killChromeExe();

    } else if (helpers.getPlatform() === 'linux') {

        helpers.killChromeLinux();
    }
   
    // killChrome({
    //     'including-main-proces' : true
    // }).then(() => {
    //     console.log('Killed tabs');
    // });
    res.setHeader('Content-Type', 'application/json');
    res.status(200);
    res.send({'message' : 'Attempt to close browser.'});
});

expressServer.get('/getLocalIp', (req, res) => {

    res.setHeader('Content-Type', 'application/json');
    res.send({'ip' : helpers.getLocalIp()});
    res.status(200);


});

expressServer.get('/ping', (req, res) => {

    res.setHeader('Content-Type', 'application/json');
    res.send({'ok' : true});
    res.status(200);

});

// Server Module.
const server = {};

server.run = () => {

    const port = process.env.PORT;
    const controlServerPath = process.env.CONTROL_SERVER;
    const name = process.env.NAME;

    expressServer.listen(port, () => {


        console.log('Server er startet, lytter på http://localhost:' + port);
        console.log('process.platform', process.platform);
        console.log('process.results', results);

        helpers.setLocalIp(Object.values(results)[0][0]);
    
        let path = controlServerPath + '/call/register';


        fetch(path, {
            method: "POST", // or 'PUT'
            headers: {
            "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: name,
                port : port,
                platform : process.platform,
                config: results
            }),
        })  
        .then((response) => response.json())
        .then((response) => {
            console.log("Success:", response);

        })
        .catch((error) => {
        
            console.log("Error:", error);

        });


        // if(process.platform === 'win32') {
            
        //     helpers.startWinCrome(port);

        // } else if (process.platform === 'darwin') {

        //     helpers.startMacCrome(port);
        // }
        // else if (process.platform === 'linux') {

        //     helpers.startPiLinux(port);
        // }

    });
    
};

module.exports = server;
