
import { PermissionAction } from "../enums/permissionAction";
import { PermissionLevel } from "../enums/permissionLevel";

export interface IRole {
    name: string,
    resources: IResourcePermissions[],
    createdAt?: Date,
    updatedAt?: Date
}

export interface IResourcePermissions {
    name: string,
    permissions: IPermission[]
}

export interface IPermission {
    action: PermissionAction;
    level: PermissionLevel;
}
