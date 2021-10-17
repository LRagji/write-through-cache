import { IBulkResponse } from "../bulk-response";
import { DimensionalData } from "../dimensional-data";
import { IError } from "../interfaces/i-error";

export class LogStructureMeta {
    async appendMeta(partitionedData: Array<DimensionalData>): Promise<IBulkResponse<Array<DimensionalData>, Array<IError<DimensionalData>>>> {
        throw new Error("Not Implemented.");
    }
}