import fetchIntercept from "fetch-intercept";
import mitt from "mitt";
import { Api } from "./api";

export enum ApiEvent {
  ResponseError = "ResponseError",
}

export interface ApiErrorEventData {
  msg?: string;
  label?: string;
}

export interface ApiEventHandler {
  (data: ApiErrorEventData): any;
}

export const apiEmitter = mitt();

fetchIntercept.register({
  response: function (response) {
    if (response.ok) return response;
    response.json().then((result) => {
      const { msg, label } = result;
      if (!msg && !label) return;
      apiEmitter.emit<ApiErrorEventData>(ApiEvent.ResponseError, { msg, label });
    });
    return response;
  },
});

export default new Api({
  baseUrl: process.env.REACT_APP_BASE_API,
});
