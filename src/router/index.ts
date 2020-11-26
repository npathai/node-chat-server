import * as express from 'express';
import UserRouter from './UserRouter';
import { IServer } from '../interfaces/ServerInterface';

import Auth from "../services/JwtToken";
import ConversationRouter from "./ConversationRouter";
import {PushServer} from "../pushServer";

export default class Routes {
    /**
     * @param  {IServer} server
     * @returns void
     */
    private static conversationRouter: ConversationRouter;

    static init(server: IServer, notificationServer: PushServer): void {
        const router: express.Router = express.Router();
        server.app.use('/', router);
        server.app.use('/api/verify', Auth.verifyRequestAuth);
        server.app.use('/api/users', new UserRouter().router);

        Routes.conversationRouter = new ConversationRouter(notificationServer)
        server.app.use('/api/conversations', this.conversationRouter.router)
    }
}
