import {IRoleModel, Role} from "../models/role";
import {IResourcePermissions} from "../interfaces/role";
import {Post} from "../models/post";

const logger = require('../winston');

module.exports.getRoles = (callback: (err: any, roles?: IRoleModel[]) => {}) => {
    Role.find({}, (err, roles) => {
        if (err) callback(err);
        else callback(null, roles);
    });
};

module.exports.getRoleById = (id: string, callback: (err: any, role?: IRoleModel) => {}) => {
    Role.findById(id, (err, role) => {
        if (err) callback(err);
        else callback(null, role);
    });
};

module.exports.getRoleByName = (name: string, callback: (err: any, role?: IRoleModel) => {}) => {
    Role.findOne({ name: name }, (err, role) => {
        if (err) callback(err);
        else callback(null, role);
    });
};

module.exports.createRole = (roleData: string, callback: (err: any, role?: IRoleModel) => {}) => {
    Role.create(roleData, (err, post) => {
        if (err) callback(err);
        else callback(null, post);
    });
};

module.exports.updateRole = (roleId: string, roleData: string, callback: (err: any, role?: IRoleModel) => {}) => {
    Role.findByIdAndUpdate(roleId, roleData, {new: true}, (err, post) => {
        if (err) callback(err);
        else callback(null, post);
    });
};

export interface IRoleUpdateBody {
    name?: string;
    resources?: IResourcePermissions[];
};

export interface IRoleCreateBody {
    name: string;
    resources: IResourcePermissions[];
};
