import {Router, Request, Response, NextFunction} from 'express';
import {Post, IPostModel} from '../models/post';

const logger = require('../winston');
const postController = require('../controllers/post');

export class PostRouter {
    router: Router;

    constructor() {
        this.router = Router();
        this.init();
    }

    init() {
        this.router.get('/', (req: Request, res: Response, next) => {
            postController.getPosts((err: any, posts: IPostModel[]) => {
                if (err) next(err);
                else res.json(posts);
            });
        });

        this.router.post('/', (req: Request, res: Response, next) => {
            postController.createPost(req.body, (err: any, post: IPostModel) => {
                if (err) next(err);
                else res.json(post);
            });
        });

        this.router.get('/byTags', (req: Request, res: Response, next) => {
            if (!req.query.tags)
                throw new Error('\'tags\' query string was not specified');

            let tags = req.query.tags.split(',');
            postController.findPostsByTags(tags, (err: any, posts: IPostModel[]) => {
                if (err) next(err);
                else res.json(posts);
            });
        });

        this.router.get('/:id', (req: Request, res: Response, next) => {
            postController.getPostById(req.params.id, (err: any, post: IPostModel) => {
                if (err) next(err);
                else res.json(post);
            });
        });

        this.router.get('/byAuthor/:author', (req: Request, res: Response, next) => {
            postController.findPostsByAuthor(req.params.author, (err: any, posts: IPostModel[]) => {
                if (err) next(err);
                else res.json(posts);
            });
        });

        this.router.put('/:id', (req: Request, res: Response, next) => {
            postController.updatePost(req.params.id, req.body, (err: any, post: IPostModel) => {
                if (err) next(err);
                else res.json(post);
            });
        });

        this.router.delete('/:id', (req: Request, res: Response, next) => {
            postController.deletePost(req.params.id, (err: any) => {
                if (err) next(err);
                else res.status(200).send('OK');
            });
        });
    }
}

export default new PostRouter().router;