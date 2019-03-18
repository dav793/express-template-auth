import { forkJoin, bindNodeCallback } from "rxjs";

import { MongoDbHelper } from "../../helpers/mongodb.helper";
const mongoServer =  new MongoDbHelper();
const dataset = require('./datasets/default');

import {User, IUserModel} from "../../../models/user";
import {UserGroup, IUserGroupModel} from "../../../models/userGroup";
import {Role, IRoleModel} from "../../../models/role";
import {PermissionAction} from "../../../enums/permissionAction";
import {PermissionLevel} from "../../../enums/permissionLevel";
import {IPermission, IResourcePermissions} from "../../../interfaces/role";

const permissionController = require('../../../controllers/permission');

describe("permissionController => authorize", () => {

    it("should correctly allow an authorized request", (done) => {
        let mocked = {
            req: {
                user: {_id: "000000000000000000000000"}
            },
            res: {
                sendStatus: (code: number) => invokeSendStatus(code)
            },
            next: (err) => invokeNext(err)
        };

        let authMiddleware = permissionController.authorize('ResourceA', PermissionAction.READ, PermissionLevel.ALLOW);
        authMiddleware(mocked.req, mocked.res, mocked.next);

        let invokeNext = (err?) => {
            if (err) {
                fail(err);
                done();
            }

            expect(err).toBe(undefined);
            done();
        };

        let invokeSendStatus = (code: number) => {
            fail(`authentication failed with status ${code}`);
            done();
        };
    });

    it("should correctly deny an unauthorized request", (done) => {
        let mocked = {
            req: {
                user: {_id: "000000000000000000000000"}
            },
            res: {
                sendStatus: (code: number) => invokeSendStatus(code)
            },
            next: (err) => invokeNext(err)
        };

        let authMiddleware = permissionController.authorize('ResourceA', PermissionAction.CREATE, PermissionLevel.ALLOW);
        authMiddleware(mocked.req, mocked.res, mocked.next);

        let invokeNext = (err?) => {
            if (err) {
                fail(err);
                done();
            }

            fail('authorization succeeded');
            done();
        };

        let invokeSendStatus = (code: number) => {
            expect(code).toEqual(403);
            done();
        };
    });

    it("should deny a request for a resource/action/level triplet for which a permission does not exist", (done) => {
        let mocked = {
            req: {
                user: {_id: "000000000000000000000000"}
            },
            res: {
                sendStatus: (code: number) => invokeSendStatus(code)
            },
            next: (err) => invokeNext(err)
        };

        let authMiddleware = permissionController.authorize('ResourceZ', PermissionAction.CREATE, PermissionLevel.REQUEST_AUTHENTICATION);
        authMiddleware(mocked.req, mocked.res, mocked.next);

        let invokeNext = (err?) => {
            if (err) {
                fail(err);
                done();
            }

            fail('authorization succeeded');
            done();
        };

        let invokeSendStatus = (code: number) => {
            expect(code).toEqual(403);
            done();
        };
    });

    beforeEach((done) => {
        mongoServer.createConnection().subscribe(() => {
            loadDefaultDataset().subscribe(
                () => done(),
                (err) => fail(err)
            );
        });
    });

    afterEach(() => {
        mongoServer.destroyConnection();
    });
});

describe("permissionController => getUserPermissions", () => {

    it("should correctly provide all existing permissions for all roles of an user and her user groups", (done) => {
        permissionController.getUserPermissions('000000000000000000000000', (err: any, perms?: IResourcePermissions[]) => {
            if (err) {
                fail(err);
                done();
            }

            expect(perms).toEqual(jasmine.anything());

            let resourceA = perms.find(p => p.name === 'ResourceA');
            let resourceB = perms.find(p => p.name === 'ResourceB');
            if (!resourceA || !resourceB) {
                fail('resource not found');
                done();
            }

            // test resource A perms
            let rAcreatePerm = resourceA.permissions.find(p => p.action === PermissionAction.CREATE);
            let rAreadPerm = resourceA.permissions.find(p => p.action === PermissionAction.READ);
            let rAupdatePerm = resourceA.permissions.find(p => p.action === PermissionAction.UPDATE);
            let rAdeletePerm = resourceA.permissions.find(p => p.action === PermissionAction.DELETE);

            expect(rAcreatePerm.level === PermissionLevel.DENY).toBe(true);
            expect(rAreadPerm.level === PermissionLevel.ALLOW).toBe(true);
            expect(rAupdatePerm.level === PermissionLevel.ALLOW).toBe(true);
            expect(rAdeletePerm.level === PermissionLevel.DENY).toBe(true);

            // test resource B perms
            let rBcreatePerm = resourceB.permissions.find(p => p.action === PermissionAction.CREATE);
            let rBreadPerm = resourceB.permissions.find(p => p.action === PermissionAction.READ);
            let rBupdatePerm = resourceB.permissions.find(p => p.action === PermissionAction.UPDATE);
            let rBdeletePerm = resourceB.permissions.find(p => p.action === PermissionAction.DELETE);

            expect(rBcreatePerm.level === PermissionLevel.DENY).toBe(true);
            expect(rBreadPerm.level === PermissionLevel.DENY).toBe(true);
            expect(rBupdatePerm.level === PermissionLevel.DENY).toBe(true);
            expect(rBdeletePerm.level === PermissionLevel.ALLOW).toBe(true);

            done();
        });
    });

    beforeEach((done) => {
        mongoServer.createConnection().subscribe(() => {
            loadDefaultDataset().subscribe(
                () => done(),
                (err) => fail(err)
            );
        });
    });

    afterEach(() => {
        mongoServer.destroyConnection();
    });
});

describe("permissionController => combinePermissions", () => {

    it("should combine permissions from several roles correctly", (done) => {
        Role.find(
            {
                $or: [
                    {_id: "200000000000000000000000"},
                    {_id: "200000000000000000000001"}
                ]
            },
            (err: any, roles: IRoleModel[]) => {
                let perms = permissionController.combinePermissions(roles);

                expect(perms).toEqual(jasmine.anything());

                let resource = perms.find(p => p.name === 'ResourceA');
                if (!resource) {
                    fail('resource not found');
                    done();
                }

                let createPerm = resource.permissions.find(p => p.action === PermissionAction.CREATE);
                let readPerm = resource.permissions.find(p => p.action === PermissionAction.READ);
                let updatePerm = resource.permissions.find(p => p.action === PermissionAction.UPDATE);
                let deletePerm = resource.permissions.find(p => p.action === PermissionAction.DELETE);

                expect(createPerm.level === PermissionLevel.DENY).toBe(true);
                expect(readPerm.level === PermissionLevel.ALLOW).toBe(true);
                expect(updatePerm.level === PermissionLevel.ALLOW).toBe(true);
                expect(deletePerm.level === PermissionLevel.DENY).toBe(true);

                done();
            });
    });

    it("should correctly combine permissions from several roles where permission is missing from one or more roles", (done) => {
        Role.find(
            {
                $or: [
                    {_id: "200000000000000000000000"},
                    {_id: "200000000000000000000001"}
                ]
            },
            (err: any, roles: IRoleModel[]) => {
                let perms = permissionController.combinePermissions(roles);

                expect(perms).toEqual(jasmine.anything());

                let resource = perms.find(p => p.name === 'ResourceB');
                if (!resource) {
                    fail('resource not found');
                    done();
                }

                let createPerm = resource.permissions.find(p => p.action === PermissionAction.CREATE);
                let readPerm = resource.permissions.find(p => p.action === PermissionAction.READ);
                let updatePerm = resource.permissions.find(p => p.action === PermissionAction.UPDATE);
                let deletePerm = resource.permissions.find(p => p.action === PermissionAction.DELETE);

                expect(createPerm.level === PermissionLevel.DENY).toBe(true);
                expect(readPerm.level === PermissionLevel.DENY).toBe(true);
                expect(updatePerm.level === PermissionLevel.DENY).toBe(true);
                expect(deletePerm.level === PermissionLevel.ALLOW).toBe(true);

                done();
            });
    });

    // @todo: escribir prueba para cuando ningun rol tiene el permiso para el recurso

    beforeEach((done) => {
        mongoServer.createConnection().subscribe(() => {
            loadDefaultDataset().subscribe(
                () => done(),
                (err) => fail(err)
            );
        });
    });

    afterEach(() => {
        mongoServer.destroyConnection();
    });
});

describe("permissionController => getResourceActionPermission", () => {

    it("should extract permission for specific resource and action", () => {
        let perms = [
            {
                name: 'ResourceA',
                permissions: [
                    {
                        action: PermissionAction.CREATE,
                        level: PermissionLevel.ALLOW
                    }
                ]
            }
        ];

        let perm = permissionController.getResourceActionPermission(perms, 'ResourceA', PermissionAction.CREATE);

        expect(perm).toEqual(jasmine.anything());
        expect(perm.action).toEqual(PermissionAction.CREATE);
        expect(perm.level).toEqual(PermissionLevel.ALLOW);
    });

    it("should provide minimum permission for specific resource and action where permission does not exist", () => {
        let perms = [];

        let perm = permissionController.getResourceActionPermission(perms, 'ResourceA', PermissionAction.CREATE);

        expect(perm).toEqual(jasmine.anything());
        expect(perm.action).toEqual(PermissionAction.CREATE);
        expect(perm.level).toEqual(PermissionLevel.DENY);
    });

    beforeEach((done) => {
        mongoServer.createConnection().subscribe(() => {
            loadDefaultDataset().subscribe(
                () => done(),
                (err) => fail(err)
            );
        });
    });

    afterEach(() => {
        mongoServer.destroyConnection();
    });
});

const loadDefaultDataset = () => forkJoin([

    bindNodeCallback((users: any, callback: (err: any) => {}) => {
        User.create(users, (err: any) => {
            if (err) callback(err);
            else callback(null);
        });
    })(dataset.users),

    bindNodeCallback((userGroups: any, callback: (err: any) => {}) => {
        UserGroup.create(userGroups, (err: any) => {
            if (err) callback(err);
            else callback(null);
        });
    })(dataset.userGroups),

    bindNodeCallback((roles: any, callback: (err: any) => {}) => {
        Role.create(roles, (err: any) => {
            if (err) callback(err);
            else callback(null);
        });
    })(dataset.roles)

]);
