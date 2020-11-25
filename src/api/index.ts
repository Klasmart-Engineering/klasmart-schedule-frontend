import { ApolloClient, InMemoryCache } from "@apollo/client";
import fetchIntercept from "fetch-intercept";
import { LangRecordId } from "../locale/lang/type";
import { Api as AutoApi } from "./api.auto";
import { apiEmitter, ApiErrorEventData, ApiEvent } from "./emitter";
import { apiOrganizationOfPage, ORG_ID_KEY } from "./extra";
export * from "./emitter";

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
      .then((result) => {
        const { msg, label, data } = result;
        if (!msg && !label) return;
        apiEmitter.emit<ApiErrorEventData>(ApiEvent.ResponseError, { msg, label, data });
      })
      .catch(async (e) => {
        const errorLabel: LangRecordId = "general_error_unknown";
        console.error(e);
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
      return originRequest(...args).catch((err) => {
        if (err.label && !err.name) {
          err.name = err.label;
          err.message = err.data;
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
