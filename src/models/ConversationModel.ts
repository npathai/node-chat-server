import {Document, Schema} from "mongoose";
import * as connections from "../config/connection";
import {IMessageModel} from "./MessageModel";
import {MessageSchema} from './MessageModel'

export interface IConversationModel extends Document {
    members: Array<string>
    messages: Array<IMessageModel>
}

const ConversationSchema = new Schema({
    messages: [MessageSchema],
    members: {
        type: Array,
        required: true
    }
})

export default connections.db.model < IConversationModel >('Conversation', ConversationSchema);

