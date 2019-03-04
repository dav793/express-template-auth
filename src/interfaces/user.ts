
export interface IUser {
    username: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    roleIds?: string[];
    updatePassword?: boolean;
    deleted?: boolean;
}
