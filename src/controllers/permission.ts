import { Request, Response, NextFunction } from 'express';
import {bindNodeCallback, forkJoin} from "rxjs";

import {IRoleModel} from "../models/role";
import {IPermission, IResourcePermissions} from "../interfaces/role";
import {IUserModel} from "../models/user";
import {IUserGroupModel} from "../models/userGroup";

import {PermissionAction} from "../enums/permissionAction";
import {PermissionLevel} from "../enums/permissionLevel";

const logger = require('../winston');

const userController = require('../controllers/user');
const userGroupController = require('../controllers/userGroup');
const roleController = require('../controllers/role');

module.exports.authorize = (resource: string, action: PermissionAction, level: PermissionLevel) => {
    return (req: Request, res: Response, next: NextFunction) => {

        userController.getUserById(req.user._id, (err: any, user?: IUserModel) => {
            if (err)
                next(err);
            else {

                this.getUserPermissions(req.user._id, (err: any, perms?: IResourcePermissions) => {
                    if (err)
                        next(err);
                    else {
                        let perm = this.getResourceActionPermission(perms, resource, action);
                        if (perm.level >= level)
                            next();
                        else
                            res.sendStatus(403);
                    }
                });

            }

        });

    };
};

module.exports.getUserPermissions = (userId: string, callback: (err: any, perms?: IResourcePermissions[]) => {}) => {

    forkJoin([
        bindNodeCallback(userController.getUserById)(userId),
        bindNodeCallback(userGroupController.getUserGroupsByUserId)(userId)
    ]).subscribe(
        (results: any[]) => {

            let user: IUserModel = results[0];
            let groups: IUserGroupModel[] = results[1];

            if (!user) {
                callback(new Error('invalid user id'));
                return;
            }

            let roleIds = user.roleIds || [];
            groups.forEach(g => {
                roleIds = roleIds.concat(g.roleIds);
            });

            roleIds = roleIds.filter((item, pos) => {
                return roleIds.indexOf(item) == pos;      // remove duplicate roles
            });

            // get roles
            forkJoin(
                roleIds.map(roleId => bindNodeCallback(roleController.getRoleById)(roleId))
            ).subscribe(
                (roles: any[]) => {
                    let perms = this.combinePermissions(roles);     // get perms
                    callback(null, perms);
                },
                (err) => callback(err)
            );

        },
        (err) => callback(err)
    );

};

module.exports.combinePermissions = (roles: IRoleModel[]): IResourcePermissions[] => {

    let combined = [];

    roles.forEach(role => {
        role.resources.forEach((resource: IResourcePermissions) => {

            // for each resource of each role...

            // find existing resource in combined result
            let existingResource = combined.find(c => c.name === resource.name);
            if (!existingResource) {
                combined.push(resource);    // add if not exists
                return;
            }

            Object.keys(PermissionAction).forEach(action => {
                if (isNaN(Number(action)))
                    return;

                let existingPerm = existingResource.permissions.find(p => p.action == action);
                let newPerm = resource.permissions.find(p => p.action == <any> action);

                if (!existingPerm && !newPerm)
                    return;
                else if (!existingPerm && newPerm)
                    existingResource.permissions.push(newPerm);
                else if (existingPerm && newPerm)
                    existingPerm.level = Math.max(existingPerm.level, newPerm ? newPerm.level : PermissionLevel.DENY);
            });

        });
    });

    return combined;

};

module.exports.getResourcePermissions = (perms: IResourcePermissions[], resource: string): IPermission[] => {
    let res = perms.find(p => p.name === resource);
    if (!res)
        return [];
    return res.permissions;
};

module.exports.getResourceActionPermission = (perms: IResourcePermissions[], resource: string, action: PermissionAction): IPermission => {
    let resPerms = this.getResourcePermissions(perms, resource);
    let perm = resPerms.find(p => p.action === action);
    if (!perm)
        return { action: action, level: PermissionLevel.DENY };
    return perm;
};
