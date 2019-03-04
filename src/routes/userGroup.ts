import {Router, Request, Response, NextFunction} from 'express';

import {IUserGroupModel} from "../models/userGroup";

const userGroupController = require('../controllers/userGroup');

export class UserGroupRouter {
    router: Router

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {

        this.router.get('/', (req: Request, res: Response, next: NextFunction) => {
            userGroupController.getUserGroups((err: any, groups: IUserGroupModel[]) => {
                if (err) next(err);
                else res.json(groups);
            });
        });

        this.router.post('/', (req: Request, res: Response, next: NextFunction) => {
            userGroupController.createUserGroup(req.body, (err: any, group: IUserGroupModel) => {
                if (err) next(err);
                else res.json(group);
            });
        });

        this.router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
            userGroupController.getUserGroupById(req.params.id, (err: any, group: IUserGroupModel) => {
                if (err) next(err);
                else res.json(group);
            });
        });

        this.router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
            userGroupController.updateUserGroup(req.params.id, req.body, (err: any, group: IUserGroupModel) => {
                if (err) next(err);
                else res.json(group);
            });
        });

    }
}

export default new UserGroupRouter().router;
