const { networkInterfaces } = require('os');
const fetch = require('node-fetch');
const helpers = require('./helpers');
const service = {}

service.registerInfoScreen = async () => {

 
    const port = process.env.PORT;
    const controlServerPath = process.env.CONTROL_SERVER;
    const name = process.env.NAME;
    const results = Object.create(null); // Or just '{}', an empty object
    const nets = networkInterfaces();

    console.log('Server er startet, lytter på http://localhost:' + port);
    console.log('process.platform', process.platform);
    console.log('process.results', results);

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

    helpers.setLocalIp(Object.values(results)[0][0]);
    let path = controlServerPath + '/call/register';

    console.log(path, {
        name: name,
        port : port,
        platform : process.platform,
        config: results
    })

    return fetch(path, {
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


};

module.exports = service;