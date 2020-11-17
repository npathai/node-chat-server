import * as http from "http"
import {SocketEventListener} from "./SocketEventListener";

export default class WebSocketManager {
    public static wss : any
    public static connections = new Map()
    public static eventListeners: SocketEventListener[] = []

    static init(server: http.Server) : void {
        const WebSocketServer = require("websocket").server
        this.wss = new WebSocketServer({
            "httpServer": server
        })
        this.wss.on("request", request => {
            console.log("Websocket request received")
            let connection = request.accept(null, request.origin)

            connection.isAnonymous = true
            connection.userInfo = undefined

            connection.on("open", () => {
                console.log("Connection opened")
            })

            connection.on("close", () => {
                if (connection.isAnonymous) {
                    for (let entry of Array.of(WebSocketManager.connections.entries())) {
                        if (entry[1] === connection) {
                            WebSocketManager.connections.delete(entry[0])
                        }
                    }
                } else {
                    WebSocketManager.connections.delete(connection.username)
                }
                console.log("Connection closed")
            })

            connection.on("message", message => {

                let messagePayload = JSON.parse(message.utf8Data)

                console.log(`Received message ${JSON.stringify(messagePayload)}`)

                if (messagePayload.type === "bind") {
                    if (connection.isAnonymous) {
                        connection.isAnonymous = false
                        connection.username = messagePayload.username
                        WebSocketManager.connections.set(messagePayload.username, connection)
                    }
                } else if (messagePayload.type === "message") {
                    for (let messageListener of WebSocketManager.eventListeners) {
                        messageListener.handleMessageEvent(connection, messagePayload)
                    }
                } else {
                    console.log("Unknown message type")
                }
            })
        })
    }

    public static registerMessageListener(listener : SocketEventListener) : void {
        WebSocketManager.eventListeners.push(listener)
    }
}
