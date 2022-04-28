import { livePolyfill } from "./setupPolyfill";
import * as serviceWorker from "./serviceWorker";
import "./index.css";
import ReactDOM from "react-dom";
import React from "react";
import Main from "./main";

livePolyfill();
// const UNAUTHORIZED_LABEL = 'general_error_unauthorized';

// if (process.env.NODE_ENV === 'development') {
//   const { worker } = require('./mocks/browser')
//   worker.start()
// }

ReactDOM.render(<Main />, document.getElementById(`root`));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
