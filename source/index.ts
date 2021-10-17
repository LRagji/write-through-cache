import { IBulkResponse } from "./i-bulk-response";
import { IDimensionalData } from "./i-dimensional-data";
import { IError } from "./i-error";
import { LogStructureMeta } from "./log-structure/log-structure-meta";
import { IPartitionResolver } from "./partitions/i-partition-resolver";
import { PartitionBuilder } from "./partitions/partition-builder";
import { IShardResolver } from "./shard/i-shard-resolver";
import { Shard } from "./shard/shard";

export class WriteThroughCache {
    private partitionBuilder: PartitionBuilder;
    private logStructureMeta: LogStructureMeta;
    private shardResolvers: Shard;

    constructor(partitionResolvers: Array<IPartitionResolver>, shardResolvere: Array<IShardResolver>, seperatorChar = "*") {
        if ((shardResolvere.length !== partitionResolvers.length) || partitionResolvers.length === 0) {
            throw new Error(`Configuration mismatch "partitionResolvers"(${partitionResolvers.length}), "shardResolvere"(${shardResolvere.length}) should match and not be 0.`);
        }
        this.partitionBuilder = new PartitionBuilder(partitionResolvers, seperatorChar);
        this.logStructureMeta = new LogStructureMeta();
        this.shardResolvers = new Shard(shardResolvere);
    }

    async write(rawData: Array<IDimensionalData>): Promise<IBulkResponse<Array<IDimensionalData>, Array<IError<IDimensionalData>>>> {
        const lsmResponse = await this.logStructureMeta.appendMeta(rawData);
        const partitionResponse = await this.partitionBuilder.build2(lsmResponse.succeeded);
        const shardResponse = await this.shardResolvers.write(partitionResponse.succeeded);
        return {
            succeeded: shardResponse.succeeded,
            failed: Array(...lsmResponse.failed, ...partitionResponse.failed, ...shardResponse.failed)
        };
    }

    async read(): Promise<Array<IDimensionalData>> {
        throw new Error("Not Implemented");
    }

    async purgeAcquire(): Promise<Array<IDimensionalData>> {
        throw new Error("Not Implemented");
    }

    async purgeRelease(): Promise<Array<IDimensionalData>> {
        throw new Error("Not Implemented");
    }
}