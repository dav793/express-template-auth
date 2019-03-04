import {Router, Request, Response, NextFunction} from 'express';
import {Role, IRoleModel} from "../models/role";

const logger = require('../winston');
const roleController = require('../controllers/role');

export class RoleRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {

        this.router.get('/', (req: Request, res: Response, next: NextFunction) => {
            roleController.getRoles((err: any, roles: IRoleModel[]) => {
                if (err) next(err);
                else res.json(roles);
            });
        });

        this.router.get('/byName', (req: Request, res: Response, next: NextFunction) => {

            let name = req.query.name;

            roleController.getRoleByName(name, (err: any, role: IRoleModel) => {
                if (err) next(err);
                else res.json(role);
            });

        });

        this.router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
            roleController.getRoleById(req.params.id, (err: any, role: IRoleModel) => {
                if (err) next(err);
                else res.json(role);
            });
        });

    }
}

export default new RoleRouter().router;
