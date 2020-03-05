import express = require("express");
import bodyParser = require("body-parser");
import pino = require("express-pino-logger");

import { TreatSourceRepo, TreatRepo } from "../core";
import { createTreatSourceRouter } from "./treat_source_router";
import { createTreatRouter } from "./treat_router";

interface TreatsServerConfig {
  port?: number;
  treatSourceRepo: TreatSourceRepo;
  treatRepo: TreatRepo;
}

/**
 * Starts the server, nothing else. Any adjacent work
 * (getting DB connection, seeding, etc), should be done by the
 * caller
 */
export async function start(config: TreatsServerConfig) {
  const { treatSourceRepo, treatRepo, port = 3218 } = config;

  const app = express();

  app.use(pino());

  app.use(bodyParser());

  app.use("/treatsource", createTreatSourceRouter(treatSourceRepo));
  app.use("/treat", createTreatRouter({ treatSourceRepo, treatRepo }));

  app.listen(port);
}
