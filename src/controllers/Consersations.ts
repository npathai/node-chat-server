import * as express from 'express';
import ConversationModel from "../models/ConversationModel";
import MessageModel from "../models/MessageModel";
import {ChatServer} from "../chatserver";
import {Notification} from "../chatserver";

export class ConversationsController {
    notificationServer : ChatServer

    constructor(notificationServer: ChatServer) {
        this.notificationServer = notificationServer
    }

    public getConversationById(req: express.Request, res: express.Response, next: express.NextFunction): void {
        ConversationModel.findOne({
            _id: req.params['id']
        }).then(conversation => {
            res.status(200).json({_id: conversation._id, members: conversation.members, messages: conversation.messages})
        }).catch(err => {
            console.log(err)
        })
    }

    public searchConversation(req: express.Request, res: express.Response, next: express.NextFunction): void {
        ConversationModel.findOne({
            members: {$all: req.body.members}
        }).then(conversation => {
            res.status(200).json({_id: conversation._id, members: conversation.members})
        }).catch(err => {
            console.log(err)
        })
    }

    public create(req: express.Request, res: express.Response, next: express.NextFunction): void {
        let user = new ConversationModel({members: req.body.members})
        user.save().then((doc) => {
            console.log("Conversation created successfully")
            res.status(200).json({_id: doc._id, members: doc.members, messages: doc.messages})
        }).catch(err => {
            console.log(err)
            res.status(500).json({
                error: err.message
            })
        })
    }

    public postMessage(req: express.Request, res: express.Response, next: express.NextFunction): void {
        ConversationModel.findOne({
            _id: req.params['id']
        }).then(conversation => {
            conversation.messages.push(new MessageModel({
                fromName: req.body.senderName,
                message: req.body.message
            }))
            conversation.save().then(savedDoc => {
                let members = conversation.members
                // Remove self
                let lastMessage = savedDoc.messages[savedDoc.messages.length - 1]

                members = members.filter((value, index, arr) => {return value != req.body.senderName})

                for (let member of members) {
                    // FIXME send _id of last message saved
                    // FIXME this should be async
                    this.notify(new Notification(member, savedDoc._id, lastMessage))
                    // TODO This should a promise which will be helpful for blue tick feature
                }
                // Need to remove conversation id from response and think of proper solution for this
                res.status(200).json({conversationId: savedDoc._id, message: lastMessage})
            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.log(err)
        })
    }

    public notify(notification: Notification) {
        this.notificationServer.notify(notification)
    }
}