const { createProxyMiddleware } = require("http-proxy-middleware");

const proxy = {
  [`/${process.env.REACT_APP_BASE_API}`]: {
    changeOrigin: true,
    target: decodeURIComponent(process.env.REACT_APP_BASE_API),
    pathRewrite: {
      [`^/${process.env.REACT_APP_BASE_API}`]: "",
    },
  },
  [`/${process.env.REACT_APP_KO_BASE_API}`]: {
    changeOrigin: true,
    target: decodeURIComponent(process.env.REACT_APP_KO_BASE_API),
    pathRewrite: {
      [`^/${process.env.REACT_APP_KO_BASE_API}`]: "",
    },
  },
  [`/${process.env.REACT_APP_H5P_API}`]: {
    changeOrigin: true,
    target: decodeURIComponent(process.env.REACT_APP_H5P_API),
    pathRewrite: {
      [`^/${process.env.REACT_APP_H5P_API}`]: "",
    },
  },
  [`/${process.env.REACT_APP_AUTH_API}`]: {
    changeOrigin: true,
    target: decodeURIComponent(process.env.REACT_APP_AUTH_API),
    pathRewrite: {
      [`^/${process.env.REACT_APP_AUTH_API}`]: "",
    },
  },
};

module.exports = function (app) {
  Object.keys(proxy).forEach((path) => {
    app.use(createProxyMiddleware(path, proxy[path]));
  });
};
