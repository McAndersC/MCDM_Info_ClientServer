const server = require('./lib/server');

const app = {};

// Initialisere Applikation
app.init = () => {

    console.log('Init NodeJS');
    server.run();
};

app.init();

