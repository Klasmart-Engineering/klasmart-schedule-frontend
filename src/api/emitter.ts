import mitt from "mitt";

export enum ApiEvent {
  ResponseError = "ResponseError",
  Info = "Info",
  GraphQLError = "GraphQLError",
}

export interface ApiErrorEventData {
  msg?: string;
  label?: string;
  data?: any;
  onError?: (message: string) => any;
}

export interface GraphQLErrorEventData {
  msg?: string;
  label?: string;
}

export interface ApiInfoEventData {
  label?: string;
}

export interface ApiEventHandler {
  (data: ApiErrorEventData): any;
}

export const apiEmitter = mitt();
