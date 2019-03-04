import {UserGroup, IUserGroupModel} from "../models/userGroup";
import {Post} from "../models/post";

const logger = require('../winston');

module.exports.getUserGroups = (callback: (err: any, group?: IUserGroupModel[]) => {}) => {
    UserGroup.find({}, (err, groups) => {
        if (err) callback(err);
        else callback(null, groups);
    });
};

module.exports.getUserGroupById = (id: string, callback: (err: any, group?: IUserGroupModel) => {}) => {
    UserGroup.findById(id, (err, group) => {
        if (err) callback(err);
        else callback(null, group);
    });
};

module.exports.getUserGroupsByUserId = (userId: string, callback: (err: any, groups?: IUserGroupModel[]) => {}) => {
    UserGroup.find({userIds: { $all: [userId] }}, (err, groups) => {
        if (err) callback(err);
        else callback(null, groups);
    });
};

module.exports.createUserGroup = (groupData: IUserGroupBody, callback: (err: any, group?: IUserGroupModel) => {}) => {
    UserGroup.create(groupData, (err, group) => {
        if (err) callback(err);
        else callback(null, group);
    });
};

module.exports.updateUserGroup = (id: string, groupData: IUserGroupBody, callback: (err: any, group?: IUserGroupModel) => {}) => {
    UserGroup.findByIdAndUpdate(id, groupData, {new: true}, (err, group) => {
        if (err) callback(err);
        else callback(null, group);
    });
};

export interface IUserGroupBody {
    label?: string;
    userIds?: string[];
    roleIds?: string[];
};
