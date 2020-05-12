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

export const map = <T, R = T>(fn: (val: T) => Result<R>) => (
  vals: Array<T>
): Result<Array<R>> => {
  let newVals = [];
  for (let val of vals) {
    let newVal = fn(val);

    if (isError(newVal)) {
      return error(new Error(`Map resulted in error ${newVal.error}`));
    }

    newVals.push(newVal.value);
  }

  return ok(newVals);
};

export function ok<T>(value: T): Ok<T> {
  return {
    _tag: "Ok",
    value,
  };
}

export function error(e: Error): ResultError {
  return {
    _tag: "Error",
    error: e,
  };
}

export const pipe = <T>(fns: Array<(result: T) => Result<T>>) => (value: T) => {
  let val: Result<T> = ok(value);
  for (const fn of fns) {
    if (isOk(val)) {
      val = fn(val.value);
    }
  }
  return val;
};
