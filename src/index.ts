
// handle uncaught errors
// remove in production; for debugging purposes only
process.on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
});

import * as http from 'http';
import * as https from 'https';
import * as fs from 'fs';

import App from './app';
import WebSocketServer from "./ws";

const env = require('../config/environment');

const port = normalizePort( env.PORT || 8080 );
App.set('port', port);

let httpServer;
if (env.SSL) {  // encryption
    const sslOptions = {
        key: fs.readFileSync(__dirname + '/../config/ssl/temp/key.pem'),
        cert: fs.readFileSync(__dirname + '/../config/ssl/temp/certificate.pem'),
        passphrase: ''              // @TODO: add a secure passphrase
    };
    httpServer = https.createServer(sslOptions, App);
}
else            // no encryption
    httpServer = http.createServer(App);

WebSocketServer.createServer(httpServer);

httpServer.listen(port);
httpServer.on('error', onError);
httpServer.on('listening', onListening);


function normalizePort(val: number|string): number|string|boolean {
    let port: number = (typeof val === 'string') ? parseInt(val, 10) : val;
    if (isNaN(port)) return val;
    else if (port >= 0) return port;
    else return false;
}

function onError(error: NodeJS.ErrnoException): void {
    if (error.syscall !== 'listen') throw error;
    let bind = (typeof port === 'string') ? 'Pipe ' + port : 'Port ' + port;
    switch(error.code) {
        case 'EACCES':
            console.error(`${bind} requires elevated privileges`);
            process.exit(1);
            break;
        case 'EADDRINUSE':
            console.error(`${bind} is already in use`);
            process.exit(1);
            break;
        default:
            throw error;
    }
}

function onListening(): void {
    const addr = httpServer.address();
    const bind = typeof addr === 'string'
        ? 'pipe ' + addr
        : 'port ' + addr.port;
    console.log(`Server is listening on ${bind}`);
}

