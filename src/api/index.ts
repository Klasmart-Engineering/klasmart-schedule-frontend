import { ApolloClient, InMemoryCache } from "@apollo/client";
import fetchIntercept from "fetch-intercept";
import { Api } from "./api.auto";
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
        const { msg, label } = result;
        if (!msg && !label) return;
        apiEmitter.emit<ApiErrorEventData>(ApiEvent.ResponseError, { msg, label });
      })
      .catch(async (e) => {
        apiEmitter.emit<ApiErrorEventData>(ApiEvent.ResponseError, { label: response.statusText });
      });
    return response;
  },
});

export default new Api({
  baseUrl: process.env.REACT_APP_BASE_API,
});

export const gqlapi = new ApolloClient({
  uri: process.env.REACT_APP_KO_BASE_API,
  cache: new InMemoryCache(),
  credentials: "include",
});
