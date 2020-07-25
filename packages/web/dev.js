const Bundler = require("parcel-bundler");
const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(
  createProxyMiddleware("/api", {
    target: process.env.SERVER_PROXY || "http://localhost:3218",
    pathRewrite: {
      "^/pi": "",
    },
  })
);

const bundler = new Bundler("index.html");
app.use(bundler.middleware());

app.listen(Number(process.env.PORT || 1234));
