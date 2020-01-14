import express = require("express");

import { TreatSourceRouter } from "./treat_source_router";

interface TreatsServerConfig {
  port?: number;
}

export function start(config?: TreatsServerConfig) {
  const { port = 3000 } = config || {};

  const app = express();

  app.use("/treatsource", TreatSourceRouter);

  app.listen(port);
}
