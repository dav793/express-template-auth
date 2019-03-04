
db.createCollection("posts");
db.createCollection("users");
db.createCollection("usergroups");
db.createCollection("roles");

db.createUser({
    user: "sandbox",
    pwd: "12345678",
    roles: [
        {role: "readWrite", db: "sandbox"},
        {role: "dbOwner", db: "sandbox"}
    ]
});
