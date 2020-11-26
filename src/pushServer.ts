import * as http from "http"
import WebSocketManager from "./socket/WebSocketManager";

export class PushServer {
    private _server: http.Server;

    constructor(server: http.Server) {
        this._server = server;
    }

    init() {
        WebSocketManager.init(this._server)
    }

    notify(messagePayload: Notification) {
        let receiverConnection = WebSocketManager.connections.get(messagePayload.receiverName)
        if (receiverConnection != null) {
            receiverConnection.send(JSON.stringify({
                message: messagePayload.message,
                conversationId: messagePayload.conversationId}))
        }
    }
}

export class Notification {
    receiverName: string
    message: any
    conversationId: string

    constructor(receiverName: string, conversationId: string, message: any) {
        this.receiverName = receiverName;
        this.message = message;
        this.conversationId = conversationId
    }
}