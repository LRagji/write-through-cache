import { IError } from "./interfaces/i-error";
import { IMonotonicIdentityResolver } from "./interfaces/i-monotonic-identity-resolver";
import { PartitionBuilder } from "./partitions/partition-builder";

export class WriteThroughCache {

    constructor(private dimensionalIdentityResolvers: Array<IMonotonicIdentityResolver>, private builder: PartitionBuilder) { }

    async write(elements: Map<Array<string>, string>): Promise<any> {
        const response = {
            suceeded: {},
            failed: new Map<Array<string>, IError<string>>(),
            error: <unknown>null
        };
        if (elements == null) {
            response.error = new Error(`Parameter "elements" is invalid: cannot be null or undefined.`);
            return response;
        }
        if (elements.size <= 0) {
            response.error = new Error(`Parameter "elements" is invalid: cannot be of size zero.`);
            return response;
        }
        let dimenssions = Array.from(elements.keys());
        let dimensionTranspose = new Array<Array<string>>();
        dimenssions = dimenssions.filter(d => {
            if (d.length !== this.dimensionalIdentityResolvers.length) {
                const value: IError<string> = { "data": <string>elements.get(d), "error": new Error(`Parameter "elements" is invalid: dimensions${d.length} should match resolvers(${this.dimensionalIdentityResolvers.length}).`) };
                response.failed.set(d, value);
                return false;
            }
            else {
                this.dimensionalIdentityResolvers.forEach((e, idx) => dimensionTranspose[idx].push(d[idx]));
                return true;
            }
        });
        const resolutionWaitHandles = this.dimensionalIdentityResolvers.map((resolver, idx) => resolver.resolve(dimensionTranspose[idx]));
        const resolvedData = await Promise.all(resolutionWaitHandles);
        const dimensionalData = new Map<Array<bigint>, string>();
        dimenssions.forEach(d => {
            let errorString = "";
            const coordinates = d.map((str, idx) => {
                const key = resolvedData[idx].get(str);
                if (key == null || key.error !== null) {
                    errorString += key?.error?.message || `Cannot find ${str} for dimension ${idx}`;
                    return null;
                }
                else {
                    return key.data;
                }
            });
            if (errorString != "") {
                const value: IError<string> = { "data": <string>elements.get(d), "error": new Error(`Resolving failed: ${errorString}.`) };
                response.failed.set(d, value);
            }
            else {
                dimensionalData.set(<Array<bigint>>coordinates, <string>elements.get(d));
            }
        });

        const partitions = await this.builder.build(dimensionalData);

    }
}