export interface IMonotonicIdentityResolver {
    resolve(elements: Array<string>): Promise<Map<string, bigint>>
}