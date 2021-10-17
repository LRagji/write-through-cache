import { IPartitionData } from "./i-partition-data";
import { IError } from "../i-error";

export interface IPartitionResponse {
    failed: Map<Array<bigint>, IError<string>>;
    suceeded: IPartitionData;
};