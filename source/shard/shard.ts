import { IBulkResponse } from "../bulk-response";
import { DimensionalData } from "../dimensional-data";
import { IError } from "../interfaces/i-error";
import { IShardClient } from "../interfaces/i-shard-client";
import { IShardResolver } from "./i-shard-resolver";

export class Shard {

    constructor(private shardresolvers: Array<IShardResolver>) { }

    async write(data: Array<DimensionalData>, createIfNotFound: boolean = false): Promise<IBulkResponse<Array<DimensionalData>, Array<IError<DimensionalData>>>> {
        throw new Error("Not Implemented");
    }
}