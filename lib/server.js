const express = require('express');
const path = require('path');
const expressServer = express();
const cors = require('cors');
const { exec } = require('child_process');
expressServer.use(cors());
expressServer.use(express.static('client'));
expressServer.use(express.json());
expressServer.use(express.urlencoded({
    extended : true
}));

// Client Endpoint
expressServer.get('/', (req, res) => {

    res.setHeader('Content-Type', 'text/html; charset=UTF-8');
    res.sendFile(path.resolve(__dirname, '../client/index.html'));

});

// Server Module.
const server = {};

server.run = () => {

    const port = 3000;

    expressServer.listen(port, () => {

        console.log('Server er startet, lytter på http://localhost:' + port);
        console.log('process.platform', process.platform);

  

        if(process.platform === 'win32') {

            exec("start chrome --kiosk http://localhost:" + port, function(error, stdout, stderr) {
                console.log("stdout: " + stdout);
                console.log("stderr: " + stderr);
                if (error !== null) {
                    console.log("exec errror: " + error);
                }
            }) 

        } else if (process.platform === 'darwin') {

            exec("open -n -a 'Google Chrome' --args --kiosk --app=http://localhost:" + port, function(error, stdout, stderr) {
                console.log("stdout: " + stdout);
                console.log("stderr: " + stderr);
                if (error !== null) {
                    console.log("exec errror: " + error);
                }
            })


        }

    });
    
};

module.exports = server;
