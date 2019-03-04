import { Document, Schema, Model, model, Types} from 'mongoose';
import { IUser } from '../interfaces/user';

const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const env = require('../../config/environment');

export interface IUserModel extends IUser, Document {
    _id: Types.ObjectId;
    hash: String;
    salt: String;
}

export let UserSchema: Schema = new Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    firstName: {
        type: String,
        default: ''
    },
    lastName: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
    },
    roleIds: {
        type: [String],
        default: []
    },
    updatePassword: {
        type: Boolean,
        default: false
    },
    deleted: {
        type: Boolean,
        default: false
    },
    hash: String,
    salt: String
}, {
    timestamps: true
});

UserSchema.methods.setPassword = function(password) {
    this.salt = crypto.randomBytes(16).toString('hex');
    this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
};

UserSchema.methods.validPassword = function(password) {
    let hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1').toString('hex');
    return this.hash === hash;
};

UserSchema.methods.generateJwt = function() {
    let expiry = new Date();
    expiry.setDate(expiry.getDate() + 7);

    return jwt.sign({
        _id: this._id,
        email: this.email,
        username: this.username,
        exp: expiry.getTime() / 1000,
    }, env.JWT_SECRET);
};


export const User: Model<IUserModel> = model<IUserModel>('User', UserSchema);
