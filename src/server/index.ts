import path = require("path");
import { logger } from "../logger";
import { Config } from "../config";
import { connectToDB, MongoTreatRepo, PluginTreatSourceRepo } from "../db";
import * as TreatsServer from "./server";
import * as Seeder from "../seeder";
import * as UserData from "../user_data";

async function startServer() {
  logger.info("Starting server with config", Config);

  const db = connectToDB(
    `mongodb://${Config.DB_URI}:${Config.DB_PORT}/${Config.DB_NAME}`
  );

  const treatSourceRepo = new PluginTreatSourceRepo({
    moduleDirectories: [path.resolve(__dirname, "../builtin_plugins")]
  });

  const treatRepo = new MongoTreatRepo({
    db,
    treatSourceRepo
  });

  await Seeder.seedFromFile({
    path: UserData.getPaths().seed,
    treatRepo
  });

  TreatsServer.start({
    treatSourceRepo,
    treatRepo,
    port: Config.SERVER_PORT
  });
}

startServer();
