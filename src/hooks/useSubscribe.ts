import { useCallback, useMemo, useReducer } from "react";

type Action = { type: "add"; payload: Function } | { type: "trigger"; payload?: undefined };

type State = Function[];

const initState: State = [];

const reducer = (state: State, { type, payload }: Action): State => {
  switch (type) {
    case "add":
      return [...state, payload as Function];
    case "trigger":
      state.forEach((listener) => listener());
      return state;
    default:
      throw new Error();
  }
};

export default function useSubscribe() {
  const [, dispatch] = useReducer(reducer, initState);
  const trigger = useCallback(() => dispatch({ type: "trigger" }), [dispatch]);
  const subscribe = useMemo(() => (listener: Function) => dispatch({ type: "add", payload: listener }), [dispatch]);
  return { trigger, subscribe };
}
