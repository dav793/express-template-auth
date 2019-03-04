import {Router, Request, Response, NextFunction} from 'express';

import {IUserModel} from "../models/user";
import {IUserRegisterBody, IUserUpdateBody} from "../controllers/user";

const userController = require('../controllers/user');

export class UserRouter {
    router: Router

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {

        this.router.post('/login', userController.login);   // <- body must contain "username" and "password"

        this.router.post('/register', (req: Request, res: Response, next: NextFunction) => {

            let userData: IUserRegisterBody = req.body;

            userController.createUser(userData, (err: any, result: any) => {
                if (err) next(err);
                else res.status(200).json(result);
            });
        });

        this.router.put('/update/:id', (req: Request, res: Response, next: NextFunction) => {

            let userData: IUserUpdateBody = req.body;

            userController.updateUser(req.params.id, userData, (err: any, result: IUserModel) => {
                if (err) next(err);
                else res.status(200).json(result);
            });
        });

    }
}

export default new UserRouter().router;
