import React from "react";
import ReactDOM from "react-dom";
import { apiEmitter, ApiErrorEventData, ApiEvent, ApiInfoEventData } from "./api";
import { apiAddOrganizationToPageUrl, subscribeLocaleInCookie } from "./api/extra";
import { subscribeIframeMessage } from "./api/iframeMessage";
import App from "./App";
import "./index.css";
import { LangName, LangRecordId } from "./locale/lang/type";
import { localeManager, t } from "./locale/LocaleManager";
import { store } from "./reducers";
import { actError, actInfo } from "./reducers/notify";
import * as serviceWorker from "./serviceWorker";

// const UNAUTHORIZED_LABEL = 'general_error_unauthorized';

apiEmitter.on<ApiErrorEventData>(ApiEvent.ResponseError, (e) => {
  if (!e) return;
  const { label, msg, data } = e;
  // 韩国方面说： 他们会在容器外部处理未登录， 不需要通知
  // if (label === UNAUTHORIZED_LABEL) sendIframeMessage({ type: 'unauthorized', payload: null });
  const message = String(t(label as LangRecordId, data || undefined) || msg || "");
  if (message) store.dispatch(actError(message));
});

apiEmitter.on<ApiInfoEventData>(ApiEvent.Info, (e) => {
  if (!e) return;
  const { label } = e;
  const message = String(t(label as LangRecordId) || "");
  if (message) store.dispatch(actInfo(message));
});

subscribeLocaleInCookie((locale) => localeManager.toggle(locale.slice(0, 2) as LangName));
subscribeIframeMessage("changeOrganization", apiAddOrganizationToPageUrl);

// if (process.env.NODE_ENV === 'development') {
//   const { worker } = require('./mocks/browser')
//   worker.start()
// }

ReactDOM.render(
  <React.Fragment>
    <App />
  </React.Fragment>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
