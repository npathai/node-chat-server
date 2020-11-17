import UserModel from '../models/UserModel';
import * as express from 'express';
import Auth from "../services/JwtToken";
import ConversationModel from "../models/ConversationModel";
class UserController {

    /**
     * @api {get} /user Get all users
     * @apiName GetUser
     * @apiGroup User
     *
     * @apiParam {Number} id Users unique ID.
     *
     * @apiSuccess {String} firstname Firstname of the User.
     * @apiSuccess {String} lastname  Lastname of the User.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "firstname": "John",
     *       "lastname": "Doe"
     *     }
     *
     * @apiError UserNotFound The id of the User was not found.
     *
     * @apiErrorExample Error-Response:
     *     HTTP/1.1 404 Not Found
     *     {
     *       "error": "UserNotFound"
     *     }
     */
    public getAllUsers(req: express.Request, res: express.Response, next: express.NextFunction): void {
			UserModel
				.find({})
				.then((data)=> {
					res.status(200).json({data});
				})
				.catch((error: Error) => {
					res.status(500).json({
						error: error.message,
						errorStack: error.stack
					});
					next(error);
				});
    }

    public getUser(req: express.Request, res: express.Response, next: express.NextFunction): void {
			UserModel
				.findOne(
					req.params,
				)
				.then((data) => {
						res.status(200).json({ data });
				})
				.catch((error: Error) => {
						res.status(500).json({
								error: error.message,
								errorStack: error.stack
						});
						next(error);
				});
    }

    public updateUser(req: express.Request, res: express.Response, next: express.NextFunction): void {
        let updatePayload: any = {};
        UserModel.update(req.params,updatePayload)
        .then((update) => {
            res.status(200).json({ success: true });
        })
        .catch((error: Error) => {
            res.status(500).json({
                error: error.message,
                errorStack: error.stack
            });
            next(error);
        });
    }

    public createUser(req: express.Request, res: express.Response, next: express.NextFunction): void {
    	let user = new UserModel(req.body)
		user.save().then((doc) => {
			console.log("User created successfully")
			res.status(200).json({success: true})
		}).catch(err => {
			console.log(err)
			res.status(500).json({
				error: err.message
			})
		})
	}

	public loginUser(req: express.Request, res: express.Response, next: express.NextFunction): void {
		let loginRequest = req.body
		UserModel.findOne({
				name: req.body.username
			})
			.then((user) => {
				res.status(200).json({username: user.name, id: user._id})
			})
			.catch(err => {
				res.status(401).json({})
			})
	}

	public getConversationsByName(req: express.Request, res: express.Response, next: express.NextFunction): void {
		ConversationModel.find({
			members: {$in: [req.params['name']]}
		}).then(conversations => {
			res.status(200).json(conversations)
		}).catch(err => {
			res.status(500).json({})
		})
	}
}

export default new UserController();