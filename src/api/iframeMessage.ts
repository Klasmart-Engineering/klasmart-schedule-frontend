export interface IframeMessageChangeLocale {
  type: 'changeLocale';
  payload: 'en' | 'ko' | 'zh' | 'vi' | 'id';
}

export interface IframeMessageChangeOrganization {
  type: 'changeOrganization';
  // payload is the organization id
  payload: string;
}

// This message is for the situation when the child iframe want the parent window to redirect to login page
export interface IframeMessageUnauthorized {
  type: 'unauthorized';
  payload: null;
}

export type IframeMessage = IframeMessageChangeLocale | IframeMessageChangeOrganization | IframeMessageUnauthorized;

type PayloadByType<T, M> = M extends { type: T, payload: infer P } ? P : never;

interface Listener<T> {
  (payload: PayloadByType<T, IframeMessage>): any;
}

export function subscribeIframeMessage<T extends IframeMessage['type']> (type: T, listener: Listener<T>) {
  window.addEventListener('message', function(e) {
    if (e.data?.type !== type) return;
    listener(e.data.payload);
  })
}

export function sendIframeMessage(message: IframeMessage) {
  window.parent.postMessage(message, '*');
}