const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function(app) {
  appl.use(
    createProxyMiddleware("/api", {
      target: process.env.SERVER_PROXY,
      pathRewrite: {
        "^/api": "",
      },
    })
  );
};
