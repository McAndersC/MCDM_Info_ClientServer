const express = require('express');
const path = require('path');
const expressServer = express();
const cors = require('cors');

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

    });
    
};

module.exports = server;
