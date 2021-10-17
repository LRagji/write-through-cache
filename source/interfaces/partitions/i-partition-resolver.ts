export interface IPartitionResolver {
    partitionSize: bigint;
    resolvePartitionIdentity(identity: bigint): Promise<bigint>
    resolvePartitionName(identity: bigint): Promise<string>
}