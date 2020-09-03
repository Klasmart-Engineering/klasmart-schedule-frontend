import { PayloadAction } from "@reduxjs/toolkit";
import { Middleware } from "redux";

export interface LoadingMetaPayload {
  metaLoading?: boolean;
}

interface Meta {
  arg: any;
  requestId: string;
}

const START_REGEX = /\/pending$/;
const END_REGEX = /\/fulfilled$|\/rejected$/;

interface LoadingMiddlewareOptions {
  enableLoadingPayload: PayloadAction<any, string>;
  disableLoadingPayload: PayloadAction<any, string>;
}

export function createLoadingMiddleware(options: LoadingMiddlewareOptions) {
  const loadingMiddleware: Middleware<{}, any> = (store) => (next) => (action: PayloadAction<any, string, Meta>) => {
    if (!action?.meta?.arg?.metaLoading) return next(action);
    if (START_REGEX.test(action.type)) store.dispatch(options.enableLoadingPayload);
    if (END_REGEX.test(action.type)) store.dispatch(options.disableLoadingPayload);
    return next(action);
  };
  return loadingMiddleware;
}
