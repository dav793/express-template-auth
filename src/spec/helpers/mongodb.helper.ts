import {from, Observable} from 'rxjs';
import * as mongoose from 'mongoose';
import MongoMemoryServer from 'mongodb-memory-server';

const mongooseOptions = { useNewUrlParser: true };

export class MongoDbHelper {

    mongoServer: MongoMemoryServer;

    constructor() {}

    createConnection(): Observable<any> {
        this.mongoServer = new MongoMemoryServer();

        return from(
            this.mongoServer.getConnectionString()
                .then((mongoUri) => {
                    return mongoose.connect(mongoUri, mongooseOptions, (err) => {
                        if (err) fail(err);
                    });
                })
        );
    }

    destroyConnection(): void {
        mongoose.disconnect();
        this.mongoServer.stop();
    }

    getServer(): MongoMemoryServer {
        return this.mongoServer;
    }

}
