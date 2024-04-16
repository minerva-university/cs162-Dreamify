const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/api",
    createProxyMiddleware({
      target: "https://minerva-dreamify-ca41013f5340.herokuapp.com/",
      changeOrigin: true,
    })
  );
};