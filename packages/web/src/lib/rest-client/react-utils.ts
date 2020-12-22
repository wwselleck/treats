import * as React from "react";

type UseRequestFn<T> = () => Promise<T>;
interface UseRequestState<T> {
  result: T | null;
  loading: boolean;
}
type UseRequestAction<T> =
  | { type: "start" }
  | { type: "end"; result: T | null };

type UseRequestReducer<T> = (
  state: UseRequestState<T>,
  action: UseRequestAction<T>
) => UseRequestState<T>;
export const useRequest = <T>(fn: UseRequestFn<T>) => {
  const [{ result, loading }, dispatch] = React.useReducer<
    UseRequestReducer<T>
  >(
    (state, action) => {
      switch (action.type) {
        case "start":
          return { ...state, loading: true };
        case "end":
          return { result: action.result, loading: false };
      }
    },
    { result: null, loading: true }
  );
  React.useEffect(() => {
    dispatch({ type: "start" });
    fn().then((res) => {
      dispatch({ type: "end", result: res });
    });
  }, []);

  return { result, loading };
};
