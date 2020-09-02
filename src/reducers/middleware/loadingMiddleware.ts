import { PayloadAction } from "@reduxjs/toolkit";
import { Middleware } from "redux";

const type = "loading/actSetLoading";

export interface LoadingMetaPayload {
  metaLoading?: boolean;
}

interface Meta {
  arg: any;
  requestId: string;
}

const START_REGEX = /\/pending$/;
const END_REGEX = /\/fulfilled$|\/rejected$/;

export const loadingMiddleware: Middleware<{}, any> = (store) => (next) => (action: PayloadAction<any, string, Meta>) => {
  if (!action?.meta?.arg?.metaLoading) return next(action);
  if (START_REGEX.test(action.type)) store.dispatch({ type, payload: true });
  if (END_REGEX.test(action.type)) store.dispatch({ type, payload: false });
  return next(action);
};
