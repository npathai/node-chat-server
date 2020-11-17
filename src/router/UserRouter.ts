import UserController from '../controllers/Users';
import { Router } from 'express'
/**
 * @export
 * @class UserRouter
 */
export default class UserRouter {
    public router: Router;

    constructor() {
        this.router = Router();
        this.routes();
    }

    /**
     * @memberof UserRouter
     */
    public routes(): void {
        this.router.get('/', UserController.getAllUsers);
        console.log("Adding create user path")
        this.router.post('/', UserController.createUser);
        this.router.post('/login', UserController.loginUser)
        this.router.get("/:name/conversations", UserController.getConversationsByName)
    }
}
