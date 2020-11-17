import * as http from "http"
import {SocketEventListener} from "./socket/SocketEventListener"
import WebSocketManager from "./socket/WebSocketManager";
import ConversationModel from "./models/ConversationModel";
import MessageModel from "./models/MessageModel";

export class ChatServer {
    messageListener: MessageListener
    private _server: http.Server;

    constructor(server: http.Server) {
        this._server = server;
    }

    init() {
        WebSocketManager.init(this._server)
    }

    notifyIfConnected(messagePayload: Notification) {
        let receiverConnection = WebSocketManager.connections.get(messagePayload.receiverName)
        if (receiverConnection != null) {
            receiverConnection.send(JSON.stringify({receiverName: messagePayload.receiverName,
                senderName: messagePayload.senderName,
                message: messagePayload.message,
                _id: messagePayload._id,
                conversationId: messagePayload.conversationId}))
        }
    }

}

export class Notification {
    receiverName: string
    senderName: string
    message: string
    conversationId: string
    _id: string

    constructor(receiverName: string, senderName: string, message: string, conversationId: string, _id: string) {
        this.receiverName = receiverName;
        this.senderName = senderName;
        this.message = message;
        this.conversationId = conversationId
        this._id = _id
    }
}

class MessageListener implements SocketEventListener {
    handleMessageEvent(connection: any, messagePayload: any): void {
        ConversationModel.findOne({
            members: {$all: [messagePayload.senderName, messagePayload.receiverName]}
        }).then(conversation => {
            conversation.messages.push(new MessageModel({
                fromName: messagePayload.senderName,
                message: messagePayload.message
            }))
            conversation.save().then(savedDoc => {
                this.notifyIfConnected(messagePayload)
            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            let model = new ConversationModel({
                members: [messagePayload.senderName, messagePayload.receiverName],
                messages: [{
                    fromName: messagePayload.senderName,
                    message: messagePayload.message
                }]
            })
            model.save().then(doc => {
                this.notifyIfConnected(messagePayload);
            }).catch(err => {
                console.log(err)
            })
        })
    }

    private notifyIfConnected(messagePayload: any) {
        let receiverConnection = WebSocketManager.connections.get(messagePayload.receiverName)
        if (receiverConnection != null) {
            receiverConnection.send(JSON.stringify({senderName: messagePayload.senderName, message: messagePayload.message}))
        }
    }
}