export interface IError<T> {
    error: Error | undefined;
    data: T;
}