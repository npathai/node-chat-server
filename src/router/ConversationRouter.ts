import {Router} from "express";
import {ConversationsController} from "../controllers/Consersations";

import {ChatServer} from "../chatserver";
import * as express from "express";

export default class ConversationRouter {

    public router: Router;
    conversationController: ConversationsController

    constructor(notificationServer: ChatServer) {
        this.router = Router();
        this.routes(notificationServer);
    }

    public routes(notificationServer: ChatServer): void {
        this.conversationController = new ConversationsController(notificationServer)

        this.router.get('/:id', this.conversationController.getConversationById);
        this.router.post('/', this.conversationController.create)
        this.router.post('/:id/message', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            this.conversationController.postMessage(req, res, next)
        })
        this.router.get('/search', this.conversationController.searchConversation);
    }
}