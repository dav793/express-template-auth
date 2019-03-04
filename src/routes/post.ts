import {Router, Request, Response, NextFunction} from 'express';
import {Post, IPostModel} from '../models/post';

import {PermissionAction} from "../enums/permissionAction";
import {PermissionLevel} from "../enums/permissionLevel";

const logger = require('../winston');
const postController = require('../controllers/post');
const permissionController = require('../controllers/permission');

export class PostRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.get('/',
            permissionController.authorize('post', PermissionAction.READ, PermissionLevel.ALLOW),
                (req: Request, res: Response, next: NextFunction) => {

                    postController.getPosts((err: any, posts: IPostModel[]) => {
                        if (err) next(err);
                        else res.json(posts);
                    });

                });

        this.router.post('/', (req: Request, res: Response, next: NextFunction) => {
            postController.createPost(req.body, (err: any, post: IPostModel) => {
                if (err) next(err);
                else res.json(post);
            });
        });

        this.router.get('/byTags', (req: Request, res: Response, next: NextFunction) => {
            if (!req.query.tags)
                throw new Error('\'tags\' query string was not specified');

            let tags = req.query.tags.split(',');
            postController.findPostsByTags(tags, (err: any, posts: IPostModel[]) => {
                if (err) next(err);
                else res.json(posts);
            });
        });

        this.router.get('/:id', (req: Request, res: Response, next: NextFunction) => {
            postController.getPostById(req.params.id, (err: any, post: IPostModel) => {
                if (err) next(err);
                else res.json(post);
            });
        });

        this.router.get('/byAuthor/:author', (req: Request, res: Response, next: NextFunction) => {
            postController.findPostsByAuthor(req.params.author, (err: any, posts: IPostModel[]) => {
                if (err) next(err);
                else res.json(posts);
            });
        });

        this.router.put('/:id', (req: Request, res: Response, next: NextFunction) => {
            postController.updatePost(req.params.id, req.body, (err: any, post: IPostModel) => {
                if (err) next(err);
                else res.json(post);
            });
        });

        this.router.delete('/:id', (req: Request, res: Response, next: NextFunction) => {
            postController.deletePost(req.params.id, (err: any) => {
                if (err) next(err);
                else res.status(200).send('OK');
            });
        });
    }
}

export default new PostRouter().router;
