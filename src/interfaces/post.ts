
export interface IPost {
    title: string,
    body: string,
    author: string,
    tags: string[],
    createdAt?: Date,
    updatedAt?: Date
}