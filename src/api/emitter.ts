import mitt from "mitt";

export enum ApiEvent {
  ResponseError = "ResponseError",
  Info = "Info",
}

export interface ApiErrorEventData {
  msg?: string;
  label?: string;
  data?: any;
  onError?: (message: string) => any;
}

export interface ApiInfoEventData {
  label?: string;
}

export interface ApiEventHandler {
  (data: ApiErrorEventData): any;
}

export const apiEmitter = mitt();
