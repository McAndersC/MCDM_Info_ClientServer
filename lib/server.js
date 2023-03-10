const express = require('express');
const path = require('path');
const expressServer = express();
const cors = require('cors');
const { exec } = require('child_process');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const killChrome = require('kill-chrome');
dotenv.config();




expressServer.use(cors());
expressServer.use(express.static('client'));
expressServer.use(express.json());
expressServer.use(express.urlencoded({
    extended : true
}));

const { networkInterfaces } = require('os');

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
    if(process.platform === 'win32') {

        exec("start chrome --kiosk http://127.0.0.1:" + port, function(error, stdout, stderr) {
            console.log("stdout: " + stdout);
            console.log("stderr: " + stderr);
            if (error !== null) {
                console.log("exec errror: " + error);
            }
        }) 

    } else if (process.platform === 'darwin') {

        exec("open -n -a 'Google Chrome' --args --kiosk --app=http://127.0.0.1:" + port, function(error, stdout, stderr) {
            console.log("stdout: " + stdout);
            console.log("stderr: " + stderr);
            if (error !== null) {
                console.log("exec errror: " + error);
            }
        })


    }


    res.status(200);
});

expressServer.get('/kill', (req, res) => {

    
    // fkill([1337, 'Chrome']);

 
    killChrome({
        'including-main-proces' : true
    }).then(() => {
        console.log('Killed tabs');
    });
    res.status(200);
});

// Server Module.
const server = {};

server.run = () => {

    const port = process.env.PORT;
    const controlServerPath = process.env.CONTROL_SERVER;
    const name = process.env.NAME;

    expressServer.listen(port, () => {

        console.log('Server er startet, lytter p?? http://localhost:' + port);
        console.log('process.platform', process.platform);
        console.log('process.results', results);

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

        //     exec("start chrome --kiosk http://localhost:" + port, (error) => {
        //         if (error !== null) {
        //             console.log("exec errror: " + error);
        //         }
        //     }) 

        // } else if (process.platform === 'darwin') {

        //     exec("open -n -a 'Google Chrome' --args --kiosk --app=http://localhost:" + port, (error) => {
        //         if (error !== null) {
        //             console.log("exec errror: " + error);
        //         }
        //     })


        // }

    });
    
};

module.exports = server;
