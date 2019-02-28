use sandbox;

db.posts.insert({
    _id: ObjectId("000000000000000000000000"),
    title: "A.I. and the Problem of Context",
    body: "Lorem ipsum dolor sit amet...",
    author: "Mitch Turck",
    createdAt: new Date(),
    tags: ['technology', 'artificial intelligence']
});

db.posts.insert({
    _id: ObjectId("000000000000000000000001"),
    title: "Facebook is Built on Inequality",
    body: "Lorem ipsum dolor sit amet...",
    author: "Colin Horgan",
    createdAt: new Date(),
    tags: ['technology', 'social networking']
});

db.posts.insert({
    _id: ObjectId("000000000000000000000002"),
    title: "What I Learned From 30 Blockchain CEOs",
    body: "Lorem ipsum dolor sit amet...",
    author: "Misha",
    createdAt: new Date(),
    tags: ['startups', 'technology']
});

db.posts.insert({
    _id: ObjectId("000000000000000000000003"),
    title: "The World is on a Collision Course With Itself",
    body: "Lorem ipsum dolor sit amet...",
    author: "Zander Nethercutt",
    createdAt: new Date(),
    tags: ['internet', 'evolution']
});
