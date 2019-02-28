import * as WebSocket from 'ws';

const logger = require('./winston');

class WebSocketServer {

    server: any;
    pingInterval: any;

    createServer(httpServer) {
        const server = new WebSocket.Server({
            server: httpServer,
            clientTracking: true
        });

        // handle new connections
        server.on('connection', (ws: WebSocket, req) => {
            const clientAddr = req.connection.remoteAddress;
            (<any> ws).__clientAddr = clientAddr;   // associate this connection with the request IP address

            (<any> ws).isAlive = true;
            ws.on('pong', () => {
                (<any> ws).isAlive = true;
            });

            ws.on('message', (message: string) => {
                // log the received message and send it back to the client
                logger.info({
                    type: "websocket message received",
                    clientIp: clientAddr,
                    message: message
                });
                ws.send(message);
            });

            // immediately send some feedback to the incoming connection
            ws.send(`Connection with ${clientAddr} established`);
        });

        // check for broken connections
        this.pingInterval = setInterval(function ping() {
            server.clients.forEach(function each(ws) {
                if ((<any> ws).isAlive === false)
                    return ws.terminate();

                (<any> ws).isAlive = false;
                ws.ping(() => {});
            });
        }, 30000);

        this.server = server;
        return this.server;
    }

    /**
     * send a message to all connected clients
     *
     * @param {MessageParams} params
     */
    broadcast(params: MessageParams) {
        this.server.clients.forEach(function each(ws) {
            ws.send(JSON.stringify(params));
        });
    }

}

export default new WebSocketServer();

export interface MessageParams {
    key: string,
    payload: any
};