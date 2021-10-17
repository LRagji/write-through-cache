import { IDimensionalData } from "../interfaces/i-dimensional-data";
import { IPartitionResolver } from "./i-partition-resolver";
import { IPartitionResponse } from "./i-partition-response";
import { IError } from "../interfaces/i-error";
import * as dimensionalHelper from "@stdlib/ndarray";
import { DimensionalData } from "../dimensional-data";
import { IBulkResponse } from "../bulk-response";

export class PartitionBuilder {
    private shape: bigint[];

    constructor(private partitionResolvers: Array<IPartitionResolver>, private seperatorChar = '=') {
        this.shape = this.partitionResolvers.map(e => e.partitionSize);
    }

    async build(elements: IDimensionalData): Promise<IPartitionResponse> {
        const returnObject = {
            failed: new Map<Array<bigint>, IError<string>>(),
            suceeded: new Map<string, Map<bigint, string>>()
        }
        const dimensions = Array.from(elements.keys());
        for (let index = 0; index < dimensions.length; index++) {
            const dimension = dimensions[index];
            const payload = <string>elements.get(dimension);
            try {
                if (dimension.length != this.shape.length) throw new Error(`Invalid dimensions: Must be equal to resolvers(${this.shape.length}).`);
                const identityWaitHandles = dimension.map((e, idx) => this.partitionResolvers[idx].resolvePartitionIdentity(e));
                const nameWaitHandles = dimension.map((e, idx) => this.partitionResolvers[idx].resolvePartitionName(e));
                const partitionIdentityDimensions = await Promise.all(identityWaitHandles);
                const partitionIndex = BigInt(dimensionalHelper.sub2ind(this.shape.map(e => parseInt(e.toString())), ...partitionIdentityDimensions.map(e => parseInt(e.toString())), { order: "row-major" }));
                const partitionDimensionsNames = await Promise.all(nameWaitHandles);
                const partitionName = partitionDimensionsNames.join(this.seperatorChar);
                const indexedPayload = returnObject.suceeded.get(partitionName) || new Map<bigint, string>();
                indexedPayload.set(partitionIndex, payload);
                returnObject.suceeded.set(partitionName, indexedPayload);
            }
            catch (err) {
                returnObject.failed.set(dimension, {
                    error: <Error>err,
                    data: payload
                })
            }
        }
        return returnObject;
        //TODO PERF: Need to convert "@stdlib/ndarray"->sub2ind to accept Bigints to avoid converdion overheads
    }

    async build2(rawData: Array<DimensionalData>): Promise<IBulkResponse<Array<DimensionalData>, Array<IError<DimensionalData>>>> {
        throw new Error("Not Implemented");
    }

    // async parse(partitionData: Array<IPartitionDataError>): Promise<IDimensionalData> {
    //     throw new Error("Not implemented");
    // }
}

