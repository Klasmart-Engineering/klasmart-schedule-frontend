import mitt from "mitt";

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
