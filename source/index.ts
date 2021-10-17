import { IMonotonicIdentityResolver } from "./interfaces/i-monotonic-identity-resolver";

export class WriteThroughCache {

    constructor(private dimensionalIdentityResolvers: Array<IMonotonicIdentityResolver>) { }

    async write(elements: Map<Array<string>, string>): Promise<any> {
        const response = {
            suceeded: {},
            failed: new Array <
        };
        if (elements == null) throw new Error(`Parameter "elements" is invalid: cannot be null or undefined.`);
        if (elements.size <= 0) throw new Error(`Parameter "elements" is invalid: cannot be of size zero.`);
        const dimenssions = Array.from(elements.keys());
        if (dimenssions.length != this.dimensionalIdentityResolvers.length) throw new Error(`Parameter "elements" is invalid: dimensions${dimenssions.length} should match resolvers(${this.dimensionalIdentityResolvers.length}).`);
        for (let index = 0; index < this.dimensionalIdentityResolvers.length; index++) {

        }
    }
}