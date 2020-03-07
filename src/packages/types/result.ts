export interface Ok<T> {
  readonly _tag: "Ok";
  readonly value: T;
}

export interface ResultError {
  readonly _tag: "Error";
  readonly error: Error;
}
export type Result<T> = Ok<T> | ResultError;

export function isOk<T>(r: Result<T>): r is Ok<T> {
  return r._tag === "Ok";
}

export function isError<T>(r: Result<T>): r is ResultError {
  return r._tag === "Error";
}

export function ok<T>(value: T): Ok<T> {
  return {
    _tag: "Ok",
    value
  };
}

export function error(e: Error): ResultError {
  return {
    _tag: "Error",
    error: e
  };
}
