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
            res.status(200).json({id: conversation._id, members: conversation.members})
        }).catch(err => {
            console.log(err)
        })
    }

    public searchConversation(req: express.Request, res: express.Response, next: express.NextFunction): void {
        ConversationModel.findOne({
            members: {$all: req.body.members}
        }).then(conversation => {
            res.status(200).json({id: conversation._id, members: conversation.members})
        }).catch(err => {
            console.log(err)
        })
    }

    public create(req: express.Request, res: express.Response, next: express.NextFunction): void {
        let user = new ConversationModel(req.body)
        user.save().then((doc) => {
            console.log("Conversation created successfully")
            res.status(200).json({id: doc._id, success: true})
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
                members.filter((value, index, arr) => {return value != req.body.senderName})

                for (let member of members) {
                    this.notificationServer.notifyIfConnected(new Notification(req.body.senderName, member, req.body.message))
                    // TODO This should a promise which will be helpful for blue tick feature
                }
            }).catch(err => {
                console.log(err)
            })
        }).catch(err => {
            console.log(err)
        })
    }
}