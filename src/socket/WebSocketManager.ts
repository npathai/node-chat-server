import * as http from "http"

export default class WebSocketManager {
    public static wss : any
    public static connections = []

    static init(server: http.Server) : void {
        const WebSocketServer = require("websocket").server
        this.wss = new WebSocketServer({
            "httpServer": server
        })
        this.wss.on("request", request => {
            console.log("Websocket request received")
            let connection = request.accept(null, request.origin)

            WebSocketManager.connections.push(connection)
            connection.on("open", () => {
                console.log("Connection opened")
            })

            connection.on("close", () => {
                console.log("Connection closed")
            })

            connection.on("message", message => {
                console.log(`Received message ${message.utf8Data}`)
                connection.send("Hello client, it's me server")
            })
        })

        WebSocketManager.sendRequests()
    }

    static sendRequests() : void {
        for (let connection of WebSocketManager.connections) {
            connection.send(`Message ${Math.random()}`)
        }

        setTimeout(WebSocketManager.sendRequests, 5000)
    }
}
