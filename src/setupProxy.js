const { createProxyMiddleware } = require("http-proxy-middleware");

const proxy = {
  [`/${process.env.REACT_APP_BASE_API}`]: {
    changeOrigin: true,
    target: decodeURIComponent(process.env.REACT_APP_BASE_API),
    pathRewrite: {
      [`^/${process.env.REACT_APP_BASE_API}`]: "",
    },
  },
};

module.exports = function (app) {
  Object.keys(proxy).forEach((path) => {
    app.use(createProxyMiddleware(path, proxy[path]));
  });
};
