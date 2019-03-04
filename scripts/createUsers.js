
var userId_admin = new ObjectId();
var userId_visitor = new ObjectId();

var userGroupId_admins = new ObjectId();
var userGroupId_moderators = new ObjectId();

var roleId_admin = new ObjectId();
var roleId_visitor = new ObjectId();
var roleId_moderator = new ObjectId();
var roleId_writer = new ObjectId();


//  ==== USERS ====

// password is '12345678'
db.users.insert({
    "_id" : userId_admin,
    "firstName" : "Pedro",
    "lastName" : "Villalba",
    "email" : "test@email.com",
    "roleIds": [
        roleId_admin.valueOf()
    ],
    "updatePassword" : false,
    "deleted" : false,
    "username" : "admin",
    "salt" : "5f964426719302ee5b7899ed0e09c1ba",
    "hash" : "dea64a5418976b3306f945d665a3a3ef412d62ab7a3856cd9d713523e9879ca0ad626f771ff937fdeddc6347b55add27aaa8da9b9021f7ea6d0a15435b12c606",
    "createdAt": ISODate("2019-03-04T00:25:39.154Z"),
    "updatedAt": ISODate("2019-03-04T00:25:39.154Z")
});

// password is '12345678'
db.users.insert({
    "_id" : userId_visitor,
    "firstName" : "Carlos",
    "lastName" : "Montero",
    "email" : "test@email.com",
    "roleIds": [
        roleId_visitor.valueOf(),
        roleId_writer.valueOf()
    ],
    "updatePassword" : false,
    "deleted" : false,
    "username" : "cmontero",
    "salt" : "5f964426719302ee5b7899ed0e09c1ba",
    "hash" : "dea64a5418976b3306f945d665a3a3ef412d62ab7a3856cd9d713523e9879ca0ad626f771ff937fdeddc6347b55add27aaa8da9b9021f7ea6d0a15435b12c606",
    "createdAt": ISODate("2019-03-04T00:25:39.154Z"),
    "updatedAt": ISODate("2019-03-04T00:25:39.154Z")
});


//  ==== USER GROUPS ====

db.usergroups.insert({
    "_id": userGroupId_admins,
    "userIds": [ userId_admin.valueOf() ],
    "roleIds": [ roleId_admin.valueOf() ],
    "label": "administrators",
    "createdAt": ISODate("2019-03-04T00:25:39.154Z"),
    "updatedAt": ISODate("2019-03-04T00:25:39.154Z")
});

db.usergroups.insert({
    "_id": userGroupId_moderators,
    "userIds": [ userId_visitor.valueOf() ],
    "roleIds": [ roleId_moderator.valueOf() ],
    "label": "moderators",
    "createdAt": ISODate("2019-03-04T00:25:39.154Z"),
    "updatedAt": ISODate("2019-03-04T00:25:39.154Z")
});


//  ==== ROLES ====

db.roles.insert({
    "_id": roleId_admin,
    "name": "administrator",
    "resources": [
        {
            "name": "post",
            "permissions": [
                { "action": 1, "level": 3 },
                { "action": 2, "level": 3 },
                { "action": 3, "level": 3 },
                { "action": 4, "level": 3 }
            ]
        },
        {
            "name": "user",
            "permissions": [
                { "action": 1, "level": 3 },
                { "action": 2, "level": 3 },
                { "action": 3, "level": 3 },
                { "action": 4, "level": 3 }
            ]
        }
    ],
    "createdAt": ISODate("2019-03-04T00:25:39.154Z"),
    "updatedAt": ISODate("2019-03-04T00:25:39.154Z")
});

db.roles.insert({
    "_id": roleId_visitor,
    "name": "regular",
    "resources": [
        {
            "name": "post",
            "permissions": [
                { "action": 1, "level": 1 },
                { "action": 2, "level": 3 },
                { "action": 3, "level": 1 },
                { "action": 4, "level": 1 }
            ]
        },
        {
            "name": "user",
            "permissions": [
                { "action": 1, "level": 1 },
                { "action": 2, "level": 3 },
                { "action": 3, "level": 1 },
                { "action": 4, "level": 1 }
            ]
        }
    ],
    "createdAt": ISODate("2019-03-04T00:25:39.154Z"),
    "updatedAt": ISODate("2019-03-04T00:25:39.154Z")
});

db.roles.insert({
    "_id": roleId_moderator,
    "name": "moderator",
    "resources": [
        {
            "name": "post",
            "permissions": [
                { "action": 1, "level": 1 },
                { "action": 2, "level": 3 },
                { "action": 3, "level": 1 },
                { "action": 4, "level": 3 }
            ]
        }
    ],
    "createdAt": ISODate("2019-03-04T00:25:39.154Z"),
    "updatedAt": ISODate("2019-03-04T00:25:39.154Z")
});

db.roles.insert({
    "_id": roleId_writer,
    "name": "writer",
    "resources": [
        {
            "name": "post",
            "permissions": [
                { "action": 1, "level": 3 },
                { "action": 2, "level": 3 },
                { "action": 3, "level": 1 },
                { "action": 4, "level": 1 }
            ]
        },
        {
            "name": "user",
            "permissions": [
                { "action": 1, "level": 1 },
                { "action": 2, "level": 3 },
                { "action": 3, "level": 1 },
                { "action": 4, "level": 1 }
            ]
        }
    ],
    "createdAt": ISODate("2019-03-04T00:25:39.154Z"),
    "updatedAt": ISODate("2019-03-04T00:25:39.154Z")
});
