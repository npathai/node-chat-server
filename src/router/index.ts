import * as express from 'express';
import UserRouter from './UserRouter';
import { IServer } from '../interfaces/ServerInterface';

import Auth from "../services/JwtToken";
import ConversationRouter from "./ConversationRouter";
import {ChatServer} from "../chatserver";

export default class Routes {
    /**
     * @param  {IServer} server
     * @returns void
     */
    static init(server: IServer, notificationServer: ChatServer): void {
        const router: express.Router = express.Router();
        server.app.use('/', router);
        server.app.use('/api/verify', Auth.verifyRequestAuth);
        server.app.use('/api/users', new UserRouter().router);
        server.app.use('/api/conversations', new ConversationRouter(notificationServer).router)
    }
}
