import { Router, Request, Response, NextFunction } from 'express';
import { IUserModel } from '../models/user';

import * as passport from 'passport';

let User = require('../models/user').User;

module.exports.update = (userId: string, userData: IUserUpdateBody, callback: (err: any, result?: IUserModel) => {}): void => {
    User.findById(userId, (err: any, user: IUserModel) => {
        if (err)
            callback(err);
        else {
            user.firstName = userData.firstName ? userData.firstName : user.firstName;
            user.lastName = userData.lastName ? userData.lastName : user.lastName;
            user.email = userData.email ? userData.email : user.email;
            user.updatePassword = userData.updatePassword || false;

            user.save((err: any, updatedUser: IUserModel) => {
                if (err)
                    callback(err);
                else
                    callback(null, updatedUser);
            });
        }
    });
};

module.exports.register = (userData: IUserRegisterBody, callback: (err: any, result?: {token: string}) => {}): void => {
    var user = new User();

    user.username = userData.username;
    user.firstName = userData.firstName;
    user.lastName = userData.lastName;
    user.email = userData.email;
    user.updatePassword = true;

    if (userData.password) {
        user.setPassword(userData.password);

        user.save((err) => {
            if (err)
                callback(new Error("username invalid or already in use"));
            else
                callback(null, {"token": user.generateJwt()});
        });
    } else
        callback(new Error("must set a password"));
};

module.exports.login = (req: Request, res: Response, next: NextFunction): void => {

    passport.authenticate('local', function(err, user, info){
        if (err) {
            res.status(404).json(err);
            return;
        }

        if (user){
            // user is found
            if (user.deleted)
                res.status(404).json(err);
            else
                res.status(200).json({"token" : user.generateJwt()});
        }
        else {
            // user is not found
            res.status(401).json(info);
        }
    })(req, res, next);

};

export interface IUserUpdateBody {
    firstName?: string;
    lastName?: string;
    email?: string;
    updatePassword?: boolean;
};

export interface IUserRegisterBody {
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
};
