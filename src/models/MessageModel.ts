import * as connections from "../config/connection";
import {Document, Schema} from "mongoose";

export interface IMessageModel extends Document {
    fromId,
    message
    createdAt ? : Date
}

export const MessageSchema = new Schema({
    fromName: {
        type: String
    },
    message: {
        type: String
    }
})


export default connections.db.model < IMessageModel >('Message', MessageSchema);