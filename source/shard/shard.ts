import { IBulkResponse } from "../i-bulk-response";
import { IDimensionalData } from "../i-dimensional-data";
import { IError } from "../i-error";
import { IShardResolver } from "./i-shard-resolver";

export class Shard {

    constructor(private shardresolvers: Array<IShardResolver>) { }

    async write(data: Array<IDimensionalData>, createIfNotFound: boolean = false): Promise<IBulkResponse<Array<IDimensionalData>, Array<IError<IDimensionalData>>>> {
        throw new Error("Not Implemented");
    }
}