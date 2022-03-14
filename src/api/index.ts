import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, Operation, ServerError } from "@apollo/client";
import { RetryLink } from "@apollo/client/link/retry";
import fetchIntercept from "fetch-intercept";
import { GraphQLError } from "graphql";
import { LangRecordId } from "../locale/lang/type";
import { Api as AutoApi, RequestParams } from "./api.auto";
import { apiEmitter, ApiErrorEventData, ApiEvent } from "./emitter";
import { apiOrganizationOfPage, ORG_ID_KEY, refreshToken } from "./extra";
export * from "./emitter";

export type ExtendedRequestParams = RequestParams & Pick<ApiErrorEventData, "onError">;

fetchIntercept.register({
  request: function (originUrl, config: RequestInit) {
    try {
      const organization = apiOrganizationOfPage() || "";
      if (!organization) return [originUrl, config];
      const URL_REPLACE = "https://_u_r_l_r_e_p_l_a_c_e_"; 
      const url = new URL(originUrl, URL_REPLACE);
      console.log("old url",url.href)
      console.log(originUrl.indexOf(process.env.REACT_APP_BASE_API as string))
      url.searchParams.append(ORG_ID_KEY, organization);
      console.log("middle url",url.href)
      if (originUrl.indexOf(process.env.REACT_APP_BASE_API as string) < 0) {
        // 这样改一下：获取s3资源的时候不需要传orgid,不然会报403
        url.searchParams.delete(ORG_ID_KEY);
      }
      console.log("new url",url.href)
      console.log("originUrl", originUrl)
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
        if (response.status === 401 || response.status === 400) throw response;
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
      return originRequest(...args).catch(async (err) => {
        if (err.label === "general_error_unauthorized") {
          // 401时 刷新token 重新调接口s
          try {
            await refreshToken();
            return originRequest(...args);
          } catch (e) {
            console.log("e", e);
          }
        } else if (err.label && !err.name) {
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

const retry = async (count: number, operation: Operation, error: ServerError): Promise<boolean> => {
  if (count > 1) return false;
  const isAuthError = error.result?.errors.find((error: GraphQLError) => error.extensions?.code === `UNAUTHENTICATED`);
  if (!isAuthError) return false;
  try {
    await refreshToken();
    return true;
  } catch (err) {
    console.log("e", err);
    return false;
  }
};

const retryLink = new RetryLink({
  attempts: (count, operation, error) => {
    return retry(count, operation, error);
  },
});
const httpLink = new HttpLink({ uri: `${process.env.REACT_APP_KO_BASE_API}/user/`, credentials: "include" });
export const gqlapi = new ApolloClient({
  link: ApolloLink.from([retryLink, httpLink]),
  cache: new InMemoryCache(),
});
