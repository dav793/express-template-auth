import { Document, Schema, Model, model, Types} from 'mongoose';
import { IRole } from '../interfaces/role';

const env = require('../../config/environment');

export interface IRoleModel extends IRole, Document {
    _id: Types.ObjectId;
}

export let PermissionSchema: Schema = new Schema({
    action: Number,
    level: Number
});

export let ResourcePermissionSchema: Schema = new Schema({
    name: String,
    permissions: [PermissionSchema]
});

export let RoleSchema: Schema = new Schema({
    name: String,
    resources: [ResourcePermissionSchema]
}, {
    timestamps: true
});

// UserSchema.methods.setPassword = function(password) {
//     this.salt = crypto.randomBytes(16).toString('hex');
//     this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
// };
//
// UserSchema.methods.validPassword = function(password) {
//     let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
//     return this.hash === hash;
// };
//
// UserSchema.methods.generateJwt = function() {
//     let expiry = new Date();
//     expiry.setDate(expiry.getDate() + 7);
//
//     return jwt.sign({
//         _id: this._id,
//         email: this.email,
//         username: this.username,
//         exp: expiry.getTime() / 1000,
//     }, env.JWT_SECRET);
// };


export const Role: Model<IRoleModel> = model<IRoleModel>('Role', RoleSchema);
