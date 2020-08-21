import fetchIntercept from "fetch-intercept";
import { Api } from "./api";

fetchIntercept.register({
  // request: function (url, config) {
  //     // Modify the url or config here
  //     return [url, config];
  // },
  // requestError: function (error) {
  //     // Called when an error occured during another 'request' interceptor call
  //     return Promise.reject(error);
  // },
  // response: function (response) {
  //     // Modify the reponse object
  //     return response;
  // },
  // responseError: function (error) {
  //     // Handle an fetch error
  //     return Promise.reject(error);
  // }
});

export default new Api({
  baseUrl: process.env.REACT_APP_BASE_API,
});
