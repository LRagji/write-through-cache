import { IShardClient } from "./i-shard-client";

export interface IShardResolver {
    resolve(partitionName: string): Promise<IShardClient>
}