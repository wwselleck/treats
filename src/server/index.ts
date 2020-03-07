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
import * as Seeder from "../packages/seeder";
import { UserData } from "../packages/user_data";

async function startServer() {
  logger.info("Starting server with config", Config);

  const db = connectToDB(
    `mongodb://${Config.DB_URI}:${Config.DB_PORT}/${Config.DB_NAME}`
  );

  const treatSourceService = new PluginTreatSourceService({
    moduleDirectories: [path.resolve(__dirname, "../packages/builtin_plugins")]
  });

  const treatService = new MongoTreatService({
    db,
    treatSourceService
  });

  await Seeder.seed({
    data: JSON.parse(await UserData.readFile(Config.SEED_FILE_NAME)),
    treatService
  });

  TreatsServer.start({
    treatSourceService,
    treatService,
    port: Config.SERVER_PORT
  });
}

startServer();
