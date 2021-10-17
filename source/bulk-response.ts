export interface IBulkResponse<successType, failureType> {
    succeeded: successType;
    failed: failureType;
}