import { Document, Schema, Model, model, Types} from 'mongoose';
import { IPost } from '../interfaces/post';

const logger = require('../winston');

export interface IPostModel extends IPost, Document {
    _id: Types.ObjectId;
}

export var PostSchema: Schema = new Schema({
    title: String,
    body: String,
    author: String,
    tags: [String]
}, {
    timestamps: true
});

export const Post: Model<IPostModel> = model<IPostModel>('Post', PostSchema);