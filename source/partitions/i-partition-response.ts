import { IPartitionData } from "./i-partition-data";
import { IError } from "../interfaces/i-error";

export interface IPartitionResponse {
    failed: Map<Array<bigint>, IError<string>>;
    suceeded: IPartitionData;
};