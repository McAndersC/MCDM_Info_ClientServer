const express = require('express');
const path = require('path');
const expressServer = express();
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

expressServer.use(cors());
expressServer.use(express.static('client'));
expressServer.use(express.json());
expressServer.use(express.urlencoded({
    extended : true
}));

const helpers = require('./helpers');
const service = require('./service');




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

    expressServer.listen(port, () => {



    
        service.registerInfoScreen();
       
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
