import { IError } from "../i-error";
import { IMonotonicIdentityResolver } from "../identity/i-monotonic-identity-resolver";
import { IDimensionalData } from "../i-dimensional-data";
import { IBulkResponse } from "../i-bulk-response";

export class DimensionalIdentity {

    constructor(private dimensionalIdentityResolvers: Array<IMonotonicIdentityResolver>) { }

    async identify(rawData: Array<IDimensionalData>): Promise<IBulkResponse<Array<IDimensionalData>, Array<IError<IDimensionalData>>>> {
        throw new Error("Not Implemented");
        // const response = {
        //     suceeded: {},
        //     failed: new Map<Array<string>, IError<string>>(),
        //     error: <unknown>null
        // };
        // if (elements == null) {
        //     response.error = new Error(`Parameter "elements" is invalid: cannot be null or undefined.`);
        //     return response;
        // }
        // if (elements.size <= 0) {
        //     response.error = new Error(`Parameter "elements" is invalid: cannot be of size zero.`);
        //     return response;
        // }
        // let dimenssions = Array.from(elements.keys());
        // let dimensionTranspose = new Array<Array<string>>();
        // dimenssions = dimenssions.filter(d => {
        //     if (d.length !== this.dimensionalIdentityResolvers.length) {
        //         const value: IError<string> = { "data": <string>elements.get(d), "error": new Error(`Parameter "elements" is invalid: dimensions${d.length} should match resolvers(${this.dimensionalIdentityResolvers.length}).`) };
        //         response.failed.set(d, value);
        //         return false;
        //     }
        //     else {
        //         this.dimensionalIdentityResolvers.forEach((e, idx) => dimensionTranspose[idx].push(d[idx]));
        //         return true;
        //     }
        // });
        // const resolutionWaitHandles = this.dimensionalIdentityResolvers.map((resolver, idx) => resolver.resolve(dimensionTranspose[idx]));
        // const resolvedData = await Promise.all(resolutionWaitHandles);
        // const dimensionalData = new Map<Array<bigint>, string>();
        // dimenssions.forEach(d => {
        //     let errorString = "";
        //     const coordinates = d.map((str, idx) => {
        //         const key = resolvedData[idx].get(str);
        //         if (key == null || key.error !== null) {
        //             errorString += key?.error?.message || `Cannot find ${str} for dimension ${idx}`;
        //             return null;
        //         }
        //         else {
        //             return key.data;
        //         }
        //     });
        //     if (errorString != "") {
        //         const value: IError<string> = { "data": <string>elements.get(d), "error": new Error(`Resolving failed: ${errorString}.`) };
        //         response.failed.set(d, value);
        //     }
        //     else {
        //         dimensionalData.set(<Array<bigint>>coordinates, <string>elements.get(d));
        //     }
        // });
    }
}