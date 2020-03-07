import express = require("express");
import bodyParser = require("body-parser");
import pino = require("express-pino-logger");

import { TreatSourceService, TreatService } from "../packages/core";
import { createTreatSourceRouter } from "./treat_source_router";
import { createTreatRouter } from "./treat_router";

interface TreatsServerConfig {
  port?: number;
  treatSourceService: TreatSourceService;
  treatService: TreatService;
}

/**
 * Starts the server, nothing else. Any adjacent work
 * (getting DB connection, seeding, etc), should be done by the
 * caller
 */
export async function start(config: TreatsServerConfig) {
  const { treatSourceService, treatService, port = 3218 } = config;

  const app = express();

  app.use(pino());

  app.use(bodyParser());

  app.use("/treatsource", createTreatSourceRouter(treatSourceService));
  app.use("/treat", createTreatRouter({ treatSourceService, treatService }));

  app.listen(port);
}
