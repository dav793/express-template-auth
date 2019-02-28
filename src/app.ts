import * as express from 'express';
import * as morgan from 'morgan';
import * as bodyParser from 'body-parser';
import * as mongoose from 'mongoose';
import * as passport from 'passport';

// routes
import IndexRouter from './routes/index';
import PostRouter from './routes/post';
import UserRouter from './routes/user';

const env = require('../config/environment');
const logger = require('./winston');

class App {

    // ref to Express instance
    public express: express.Application;

    // Run configuration methods on the Express instance.
    constructor() {
        this.express = express();
        this.database();
        this.middleware();
        this.authentication();
        this.routes();
        this.handleErrors();    // this needs to be the last function called
    }

    // Configure database connection.
    private database(): void {
        if (process.env.NODE_ENV === 'test')
            return;

        let url;
        if (env.DB_AUTH)
            url = `mongodb://${env.DB_USER}:${env.DB_PWD}@${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;
        else
            url = `mongodb://${env.DB_HOST}:${env.DB_PORT}/${env.DB_NAME}`;
        mongoose.connect(url, { useNewUrlParser: true, useFindAndModify: false });

        let db = mongoose.connection;
        db.on('error', console.error.bind(console, 'connection error:'));
        db.once('open', function () {
            console.log("Connection to DB server established");
        });
    }

    // Configure Express middleware.
    private middleware(): void {
        // third party middleware
        this.express.use(morgan('dev', { stream: logger.stream }));
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));

        // application-level middleware
        // @todo: add middleware
    }

    // Configure user authentication.
    private authentication(): void {
        require('./models/user').User;
        require('./passport');
        this.express.use(passport.initialize());

        const expressJwt = require('express-jwt');
        const authenticate = expressJwt({secret : env.JWT_SECRET});

        // protect api routes
        this.express.use('/posts', authenticate, (req, res, next) => { next(); });
    }

    // Configure API endpoints.
    private routes(): void {
        this.express.use('/', IndexRouter);
        this.express.use('/posts', PostRouter);
        this.express.use('/users', UserRouter);

        // 404 response
        this.express.all('*', (req: any, res: any) => {
            console.log(`[TRACE] Server 404 request: ${req.originalUrl}`);
            res.sendStatus(404);
        });
    }

    private handleErrors(): void {
        this.express.use((err, req, res, next) => {     // express error handling
            logger.error(err.stack);

            if (res.headersSent)
                return next(err)    // delegate to default error-handler if response has already begun being sent

            if (process.env.NODE_ENV === 'production')
                res.status(500).send(err.message);
            else
                res.status(500).send(err.stack);
        });
    }

}

export default new App().express;
