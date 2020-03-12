export * from "./serialize";

import path = require("path");
import { logger } from "../packages/logger";
import { Config } from "../packages/config";
import { connectToDB, MongoTreatService } from "../packages/db";
import { PluginService, PluginTreatSourceService } from "../packages/plugin";
import { UserDataTreatService } from "../packages/user_data";
import { TreatItemLoader } from "../packages/item_loader";
import * as TreatsServer from "./server";

async function loadLocalModeDeps() {
  const pluginService = await PluginService.create({
    moduleDirectories: [path.resolve(__dirname, "../packages/builtin_plugins")]
  });
  const treatSourceService = new PluginTreatSourceService(pluginService);
  const treatService = new UserDataTreatService(treatSourceService);

  const treatItemLoader = new TreatItemLoader(pluginService);
  return { treatSourceService, treatService, treatItemLoader };
}

async function loadDeps() {
  if (Config.LOCAL_MODE) {
    return loadLocalModeDeps();
  } else {
    const db = connectToDB(
      `mongodb://${Config.DB_URI}:${Config.DB_PORT}/${Config.DB_NAME}`
    );

    const pluginService = await PluginService.create({
      moduleDirectories: [
        path.resolve(__dirname, "../packages/builtin_plugins")
      ]
    });
    const treatSourceService = new PluginTreatSourceService(pluginService);

    const treatService = new MongoTreatService({
      db,
      treatSourceService
    });

    const treatItemLoader = new TreatItemLoader(pluginService);

    return { treatSourceService, treatService, treatItemLoader };
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
