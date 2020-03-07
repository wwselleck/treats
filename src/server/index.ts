export * from "./serialize";

import path = require("path");
import { logger } from "../packages/logger";
import { Config } from "../packages/config";
import {
  connectToDB,
  MongoTreatService,
  PluginTreatSourceService
} from "../packages/db";
import * as TreatsServer from "./server";
import { UserDataTreatService } from "../packages/user_data";

async function loadLocalModeDeps() {
  const treatSourceService = new PluginTreatSourceService({
    moduleDirectories: [path.resolve(__dirname, "../packages/builtin_plugins")]
  });
  const treatService = new UserDataTreatService(treatSourceService);
  return { treatSourceService, treatService };
}

async function loadDeps() {
  if (Config.LOCAL_MODE) {
    return loadLocalModeDeps();
  } else {
    const db = connectToDB(
      `mongodb://${Config.DB_URI}:${Config.DB_PORT}/${Config.DB_NAME}`
    );

    const treatSourceService = new PluginTreatSourceService({
      moduleDirectories: [
        path.resolve(__dirname, "../packages/builtin_plugins")
      ]
    });

    const treatService = new MongoTreatService({
      db,
      treatSourceService
    });

    return { treatSourceService, treatService };
  }
}

async function startServer() {
  logger.info("Starting server with config", Config);

  const deps = await loadDeps();
  TreatsServer.start({
    port: Config.SERVER_PORT,
    ...deps
  });
}

startServer();
