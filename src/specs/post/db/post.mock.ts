import * as mongoose from 'mongoose';

module.exports = [
    {
        _id: mongoose.Types.ObjectId("000000000000000000000000"),
        title: "A Mock Post",
        body: "Lorem ipsum dolor sit amet...",
        author: "Mock Author A",
        createdAt: new Date(),
        tags: ['mock tag 1', 'mock tag 2']
    },
    {
        _id: mongoose.Types.ObjectId("000000000000000000000001"),
        title: "Another Mock Post",
        body: "Lorem ipsum dolor sit amet...",
        author: "Mock Author B",
        createdAt: new Date(),
        tags: ['mock tag 3']
    }
];