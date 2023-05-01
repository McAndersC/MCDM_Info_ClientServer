const helpers = {};

const { exec } = require('child_process');


helpers.startWinCrome = (port) => exec("start chrome --kiosk http://127.0.0.1:" + port, (error) => {
    if (error !== null) {
        console.log("exec errror: " + error);
    }
})  

helpers.startMacCrome = (port) => exec("open -n -a 'Google Chrome' --args --kiosk --app=http://127.0.0.1:" + port, (error) => {
    if (error !== null) {
        console.log("exec errror: " + error);
    }
})


module.exports = helpers;