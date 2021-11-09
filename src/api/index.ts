import { ApolloClient, InMemoryCache } from "@apollo/client";
import fetchIntercept from "fetch-intercept";
import { LangRecordId } from "../locale/lang/type";
import { Api as AutoApi, RequestParams } from "./api.auto";
import { apiEmitter, ApiErrorEventData, ApiEvent } from "./emitter";
import { apiOrganizationOfPage, ORG_ID_KEY } from "./extra";
export * from "./emitter";

export type ExtendedRequestParams = RequestParams & Pick<ApiErrorEventData, "onError">;

fetchIntercept.register({
  request: function (originUrl, config: RequestInit) {
    try {
      const organization = apiOrganizationOfPage() || "";
      if (!organization) return [originUrl, config];
      const URL_REPLACE = "https://_u_r_l_r_e_p_l_a_c_e_";
      const url = new URL(originUrl, URL_REPLACE);
      url.searchParams.append(ORG_ID_KEY, organization);
      return [url.toString().replace(URL_REPLACE, ""), config];
    } catch (err) {
      console.error(err);
      return [originUrl, config];
    }
  },
  response: function (response) {
    if (response.ok) return response;
    response
      .clone()
      .json()
      .catch(async (e) => {
        const errorLabel: LangRecordId = "general_error_unknown";
        console.log("e", response.body);
        apiEmitter.emit<ApiErrorEventData>(ApiEvent.ResponseError, { label: errorLabel });
      });
    return response;
  },
});

class Api extends AutoApi {
  constructor(...props: ConstructorParameters<typeof AutoApi>) {
    super(...props);
    const originRequest = this.request;
    this.request = (...args) => {
      const [, , params] = args;
      const onError = (params as ExtendedRequestParams | undefined)?.onError;
      return originRequest(...args).catch((err) => {
        if (err.label && !err.name) {
          const { msg, label, data } = err;
          err.name = err.label;
          err.message = err.data;
          apiEmitter.emit<ApiErrorEventData>(ApiEvent.ResponseError, { msg, label, data, onError });
        }
        throw err;
      });
    };
  }
}

export default new Api({
  baseUrl: process.env.REACT_APP_BASE_API,
});

export const gqlapi = new ApolloClient({
  uri: process.env.REACT_APP_KO_BASE_API,
  cache: new InMemoryCache(),
  credentials: "include",
});
