import { Api } from "./api";

export default new Api({
  baseUrl: process.env.REACT_APP_BASE_API,
});
