export * from "./serialize";

import path = require("path");
import { logger } from "./logger";
import { Config } from "./config";
import { connectToDB, MongoTreatService } from "./db";
import { PluginService, PluginTreatSourceService } from "./plugin";
import { UserDataTreatService } from "./user_data";
import { TreatItemLoader } from "./item_loader";
import * as TreatsServer from "./server";

async function loadLocalModeDeps() {
  const pluginService = await PluginService.create({
    moduleDirectories: [path.resolve(__dirname, "./builtin_plugins")],
  });
  const treatSourceService = new PluginTreatSourceService(pluginService);
  const treatService = new UserDataTreatService();

  const treatItemLoader = new TreatItemLoader(
    pluginService,
    treatSourceService
  );
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
      moduleDirectories: [path.resolve(__dirname, "./builtin_plugins")],
    });
    const treatSourceService = new PluginTreatSourceService(pluginService);

    const treatService = new MongoTreatService({
      db,
    });

    const treatItemLoader = new TreatItemLoader(
      pluginService,
      treatSourceService
    );

    return { treatSourceService, treatService, treatItemLoader };
  }
}

async function startServer() {
  logger.info("Starting server with config", Config);

  const deps = await loadDeps();
  TreatsServer.start({
    port: Config.SERVER_PORT,
    ...deps,
  });
}

startServer();
