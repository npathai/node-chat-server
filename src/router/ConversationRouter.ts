import {Router} from "express";
import {ConversationsController} from "../controllers/Consersations";

import {ChatServer} from "../chatserver";

export default class ConversationRouter {

    public router: Router;

    constructor(notificationServer: ChatServer) {
        this.router = Router();
        this.routes(notificationServer);
    }

    /**
     * @memberof UserRouter
     */
    public routes(notificationServer: ChatServer): void {
        let conversationController = new ConversationsController(notificationServer)
        this.router.get('/{id}', conversationController.getConversationById);
        this.router.post('/', conversationController.create)
        this.router.post('/{id}/message', conversationController.postMessage)
        this.router.get('/search', conversationController.searchConversation);
    }
}