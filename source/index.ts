import { IBulkResponse } from "./bulk-response";
import { DimensionalData } from "./dimensional-data";
import { DimensionalIdentity } from "./identity/dimensional-identity";
import { IMonotonicIdentityResolver } from "./identity/i-monotonic-identity-resolver";
import { IError } from "./interfaces/i-error";
import { LogStructureMeta } from "./log-structure/log-structure-meta";
import { IPartitionResolver } from "./partitions/i-partition-resolver";
import { PartitionBuilder } from "./partitions/partition-builder";
import { IShardResolver } from "./shard/i-shard-resolver";
import { Shard } from "./shard/shard";

export class WriteThroughCache {
    private dimensionalIdentity: DimensionalIdentity;
    private partitionBuilder: PartitionBuilder;
    private logStructureMeta: LogStructureMeta;
    private shardResolvers: Shard;

    constructor(identityResolvers: Array<IMonotonicIdentityResolver>, partitionResolvers: Array<IPartitionResolver>, shardResolvere: Array<IShardResolver>, seperatorChar = "*") {
        if ((identityResolvers.length !== partitionResolvers.length &&
            shardResolvere.length !== partitionResolvers.length) ||
            partitionResolvers.length === 0) {
            throw new Error(`Configuration mismatch "identityResolvers"(${identityResolvers.length}), "partitionResolvers"(${partitionResolvers.length}), "shardResolvere"(${shardResolvere.length}) should match and not be 0.`);
        }
        this.dimensionalIdentity = new DimensionalIdentity(identityResolvers)
        this.partitionBuilder = new PartitionBuilder(partitionResolvers, seperatorChar);
        this.logStructureMeta = new LogStructureMeta();
        this.shardResolvers = new Shard(shardResolvere);
    }

    async write(rawData: Array<DimensionalData>): Promise<IBulkResponse<Array<DimensionalData>, Array<IError<DimensionalData>>>> {
        const identityResponse = await this.dimensionalIdentity.identify(rawData);
        const lsmResponse = await this.logStructureMeta.appendMeta(identityResponse.succeeded);
        const partitionResponse = await this.partitionBuilder.build2(lsmResponse.succeeded);
        const shardResponse = await this.shardResolvers.write(partitionResponse.succeeded);
        return {
            succeeded: shardResponse.succeeded,
            failed: Array(...identityResponse.failed, ...lsmResponse.failed, ...partitionResponse.failed, ...shardResponse.failed)
        };
    }
}