import { IBulkResponse } from "../bulk-response";
import { IError } from "../interfaces/i-error";
import { IShardClient } from "../interfaces/i-shard-client";

export interface IShardResolver {
    resolve(partitionName: Array<string>, createIfNotFound: boolean): Promise<IBulkResponse<Map<string, IShardClient>, IError<string>>>
}