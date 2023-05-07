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

helpers.startPiLinux = (port) => exec("DISPLAY=:0 chromium-browser --kiosk --app=http://localhost:" + port, (error) => {

    if (error !== null) {

        console.log("exec errror: " + error);

    }

})

helpers.killChromeLinux = () => exec("pkill chromium", (error) => {

    if (error !== null) {

        console.log("exec errror: " + error);
        
    }

});helpers.killChromeExe = () => exec("taskkill /f /im chrome.exe", (error) => {

    if (error !== null) {

        console.log("exec errror: " + error);
        
    }

});

helpers.setLocalIp = (ip) => {

    helpers.localIp =  ip;

}

helpers.getLocalIp = () => {

    return helpers.localIp

}

helpers.setPlatform = (platform) => {

    helpers.platform = platform;

}

helpers.getPlatform = () => {

    return helpers.platform;

}


module.exports = helpers;