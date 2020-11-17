import * as debug from 'debug';
import * as http from 'http';
import {Server} from './server';
import * as serverHandlers from './serverHandlers';
import WebSocketManager from "./socket/WebSocketManager";
import {ChatServer} from "./chatserver";

debug('ts-express:server');

const port: string | number | boolean = serverHandlers.normalizePort(process.env.PORT || 3000);

const expressServer: Server = new Server()

expressServer.app.set('port', port);

console.log(`Server listening on port ${port}`);
const server: http.Server = http.createServer(expressServer.app);

const chatServer: ChatServer = new ChatServer(server)

expressServer.init(chatServer)

// server listen
server.listen(port);

// server handlers
server.on(
    'error',
    (error) => serverHandlers.onError(error, port));
server.on(
    'listening',
    serverHandlers.onListening.bind(server));
server.on(
    'listening', () => {
        chatServer.init()
    });
