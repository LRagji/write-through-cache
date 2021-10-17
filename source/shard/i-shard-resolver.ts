import { IBulkResponse } from "../i-bulk-response";
import { IError } from "../i-error";
import { IShardClient } from "./i-shard-client";

export interface IShardResolver {
    resolve(partitionName: Array<string>, createIfNotFound: boolean): Promise<IBulkResponse<Map<string, IShardClient>, IError<string>>>
}