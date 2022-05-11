import { livePolyfill } from "./setupPolyfill";
import * as serviceWorker from "./serviceWorker";
import ReactDOM from "react-dom";
import React from "react";
import Main from "./main";
import { GlobalStateProvider } from "@kl-engineering/frontend-state";

livePolyfill();
// const UNAUTHORIZED_LABEL = 'general_error_unauthorized';

// if (process.env.NODE_ENV === 'development') {
//   const { worker } = require('./mocks/browser')
//   worker.start()
// }

ReactDOM.render(
  <GlobalStateProvider cookieDomain={process.env.REACT_APP_BASE_DOMAIN || ""}>
    <Main />
  </GlobalStateProvider>,
  document.getElementById(`root`)
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
