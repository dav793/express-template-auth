import {IRoleModel, Role} from "../models/role";

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
