import { Document, Schema, Model, model, Types} from 'mongoose';
import { IUserGroup } from '../interfaces/userGroup';

const env = require('../../config/environment');

export interface IUserGroupModel extends IUserGroup, Document {
    _id: Types.ObjectId;
}

export let UserGroupSchema: Schema = new Schema({
    label: String,
    userIds: [String],
    roleIds: [String]
}, {
    timestamps: true
});

export const UserGroup: Model<IUserGroupModel> = model<IUserGroupModel>('UserGroup', UserGroupSchema);
