import { IBulkResponse } from "../i-bulk-response";
import { IDimensionalData } from "../i-dimensional-data";
import { IError } from "../i-error";

export class LogStructureMeta {
    async appendMeta(partitionedData: Array<IDimensionalData>): Promise<IBulkResponse<Array<IDimensionalData>, Array<IError<IDimensionalData>>>> {
        throw new Error("Not Implemented.");
    }
}