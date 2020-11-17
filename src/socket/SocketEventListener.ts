export interface SocketEventListener {
    handleMessageEvent(connection: any, messagePayload: any): void
}