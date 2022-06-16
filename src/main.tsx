import React from "react";
import App from "./App";
import { apiEmitter, ApiErrorEventData, ApiEvent, ApiInfoEventData, GraphQLErrorEventData } from "@api/emitter";
import { localeManager, t } from "@locale/LocaleManager";
import { LangRecordId, shouldBeLangName } from "@locale/lang/type";
import { store } from "@reducers/index";
import { actError, actInfo } from "@reducers/notify";
import { setOrganizationId } from "@reducers/common";
import "./index.css";
import { localeState, useGlobalStateValue, currentOrganizationState } from "@kl-engineering/frontend-state";

apiEmitter.on<ApiErrorEventData>(ApiEvent.ResponseError, (e) => {
  if (!e) return;
  const { label, msg, data, onError } = e;
  // 韩国方面说： 他们会在容器外部处理未登录， 不需要通知
  // if (label === UNAUTHORIZED_LABEL) sendIframeMessage({ type: 'unauthorized', payload: null });
  const message = String(t(label as LangRecordId, data || undefined) || msg || "");
  if (message) onError ? onError(message) : store.dispatch(actError(message));
});

apiEmitter.on<ApiInfoEventData>(ApiEvent.Info, (e) => {
  if (!e) return;
  const { label } = e;
  const message = String(t(label as LangRecordId) || "");
  if (message) store.dispatch(actInfo(message));
});

apiEmitter.on<GraphQLErrorEventData>(ApiEvent.GraphQLError, (e) => {
  if (!e) return;
  const { label, msg } = e;
  const message = String(t(label as LangRecordId) || msg || "");
  if (message) store.dispatch(actError(message));
});

export default function Main() {
  const locale = useGlobalStateValue(localeState);
  const currentOrganization = useGlobalStateValue(currentOrganizationState);
  const organizationId = currentOrganization.id ?? ``;
  React.useEffect(() => {
    if (locale) localeManager.toggle(shouldBeLangName(locale.slice(0, 2) || "en"));
    if (organizationId) store.dispatch(setOrganizationId(organizationId));
  }, [organizationId, locale]);
  return <App />;
}
