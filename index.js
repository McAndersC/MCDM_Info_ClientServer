const server = require('./lib/server');

const app = {};

// Initialisere Applikation
app.init = () => {

    server.run();

};

app.init();

