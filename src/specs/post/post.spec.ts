import * as mongoose from 'mongoose';
const MongoMemoryServer = require('mongodb-memory-server').default;
const expect = require("chai").expect;
const sinon = require('sinon');

// posts
import { Post, IPostModel } from "../../models/post";
const postController = require("../../controllers/post");
const mockPosts = require("./db/post.mock");

let mongoServer;
const mongoServerOpts = { useNewUrlParser: true, useFindAndModify: false };


describe("PostController => getPostById", function() {

    it('should find a post by id', function (done) {
        postController.getPostById("000000000000000000000000", (err: any, post: IPostModel) => {
            expect(post).to.be.an("integer");
            expect(post.title).to.equal("A Mock Post");
            done();
        });
    });

    it('should return null if post with id does not exist', function (done) {
        postController.getPostById("000000000000000000000999", (err: any, post: IPostModel) => {
            expect(post).to.equal(null);
            // expect(post).to.equal(true);
            done();
        });
    });

    beforeEach(function(done) { // this is done before each test in this describe
        done();
    });

});

// describe("template spec 2", function() {
//     it('should xxx', function (done) {
//         expect(true).to.equal(true);
//         done();
//     });
// });

before((done) => {  // this is done before all tests in this spec
    mongoServer = new MongoMemoryServer();
    mongoServer.getConnectionString().then((mongoUri) => {
        return mongoose.connect(mongoUri, mongoServerOpts, (err) => {
            if (err) done(err);
        });
    }).then(() => {
        // populate mock documents
        Post.create(mockPosts, (err: any) => {
            if(err) throw(err);
            done();
        });
    });
});

after((done) => {   // this is done after all tests in this spec
    mongoose.disconnect();
    mongoServer.stop();
    done();
});
