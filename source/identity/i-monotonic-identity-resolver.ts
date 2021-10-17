import { IError } from "../i-error";

export interface IMonotonicIdentityResolver {
    resolve(elements: Array<string>): Promise<Map<string, IError<bigint>>>
}