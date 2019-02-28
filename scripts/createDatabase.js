use sandbox;

db.createCollection("posts");

db.createUser({
    user: "sandbox",
    pwd: "12345678",
    roles: [
        {role: "readWrite", db: "sandbox"},
        {role: "dbOwner", db: "sandbox"}
    ]
});
