# MCDM Info ClientServer





## IMAC Sierra Install Process

### 1. HomeBrew

[https://brew.sh](https://brew.sh)


Command:
```
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### 2. Chrome
https://www.google.com/chrome/thank-you.html?brand=YTUH&statcb=0&installdataindex=empty&defaultbrowser=0

Gør Chrome til standard Browser under settings.

### 3. NodeJS

[https://nodejs.org/download/release/v17.9.1/](https://nodejs.org/download/release/v17.9.1/)

Pakken **SKAL** være 17.9.1     
https://nodejs.org/download/release/v17.9.1/node-v17.9.1.pkg 

Tilføj node til PATH variables.

Command:
```
export PATH=$PATH:/usr/local/git/bin:/usr/local/bin
```

### 3. Opret mappe MCDM

Opret mappe og clon/fork ClientServer projektet

### PM2 (Foreløbig "simple" facon).

command:

```
npm install pm2@latest -g
```
Med terminalen placeret i Users/web-mcdm/ mappen:

commanf
```
pm2 init simple
```

pm2 startup

Der oprettes en `ecosystem.config.js` fil. Åbn denne:

eco....
```javascript
module.exports = {
    apps: [{
        name : "INFO:3000",
        script : "index.js",
        cwd : "./MCDM/MCDM_Info_ClientServer/"
    }]
}
```
