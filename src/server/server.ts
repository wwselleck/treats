import express = require("express");
import bodyParser = require("body-parser");
import pino = require("express-pino-logger");

import { TreatsServerSeed } from "./services/seeder";
import { TreatSourceRepo, TreatRepo } from "./repos";
import { createTreatSourceRouter } from "./treat_source_router";
import { createTreatRouter } from "./treat_router";

interface TreatsServerConfig {
  port?: number;
  treatSourceRepo: TreatSourceRepo;
  treatRepo: TreatRepo;
  seed?: TreatsServerSeed;
}

export function start(config: TreatsServerConfig) {
  const { treatSourceRepo, treatRepo, port = 3000 } = config;

  const app = express();

  app.use(pino());

  app.use(bodyParser());

  app.use("/treatsource", createTreatSourceRouter(treatSourceRepo));
  app.use("/treat", createTreatRouter({ treatSourceRepo, treatRepo }));

  app.listen(port);
}
