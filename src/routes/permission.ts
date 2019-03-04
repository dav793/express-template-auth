import {Router, Request, Response, NextFunction} from 'express';
import {Role, IRoleModel} from "../models/role";
import {IResourcePermissions} from "../interfaces/role";

const logger = require('../winston');
const permissionController = require('../controllers/permission');

export class PermissionRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {

        this.router.get('/:userId', (req: Request, res: Response, next: NextFunction) => {
            permissionController.getUserPermissions(req.params.userId, (err: any, perms: IResourcePermissions[]) => {
                if (err)
                    next(err);
                else
                    res.json(perms);
            });
        });

        this.router.get('/:userId/:resource', (req: Request, res: Response, next: NextFunction) => {
            permissionController.getUserPermissions(req.params.userId, (err: any, perms: IResourcePermissions[]) => {
                if (err) next(err);
                else {
                    let resourcePerms = permissionController.getResourcePermissions(perms, req.params.resource);
                    res.json(resourcePerms);
                }
            });
        });

        this.router.get('/:userId/:resource/:action', (req: Request, res: Response, next: NextFunction) => {
            permissionController.getUserPermissions(req.params.userId, (err: any, perms: IResourcePermissions[]) => {
                if (err) next(err);
                else {
                    let actionPerm = permissionController.getResourceActionPermission(perms, req.params.resource, parseInt(req.params.action));
                    res.json(actionPerm);
                }
            });
        });

    }
}

export default new PermissionRouter().router;
