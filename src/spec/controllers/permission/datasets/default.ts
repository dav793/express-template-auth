
module.exports = {

    users: [
        {
            "_id" : "000000000000000000000000",
            "firstName" : "Pedro",
            "lastName" : "Villalba",
            "email" : "test@email.com",
            "roleIds": [
                "200000000000000000000000"
            ],
            "updatePassword" : false,
            "deleted" : false,
            "username" : "admin"
        }
    ],

    userGroups: [
        {
            "_id": "100000000000000000000000",
            "userIds": [ "000000000000000000000000" ],
            "roleIds": [ "200000000000000000000001" ],
            "label": "UserGroupA"
        }
    ],

    roles: [
        {
            "_id": "200000000000000000000000",
            "name": "RoleA",
            "resources": [
                {
                    "name": "ResourceA",
                    "permissions": [
                        { "action": 1, "level": 1 },
                        { "action": 2, "level": 1 },
                        { "action": 3, "level": 3 },
                        { "action": 4, "level": 1 }
                    ]
                }
            ]
        },
        {
            "_id": "200000000000000000000001",
            "name": "RoleB",
            "resources": [
                {
                    "name": "ResourceA",
                    "permissions": [
                        { "action": 1, "level": 1 },
                        { "action": 2, "level": 3 },
                        { "action": 3, "level": 1 },
                        { "action": 4, "level": 1 }
                    ]
                },
                {
                    "name": "ResourceB",
                    "permissions": [
                        { "action": 1, "level": 1 },
                        { "action": 2, "level": 1 },
                        { "action": 3, "level": 1 },
                        { "action": 4, "level": 3 }
                    ]
                }
            ]
        }
    ]

};
