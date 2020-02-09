import * as TreatsServer from "./treats_server";
import path = require("path");
import { connectToDB } from "./db";
import { PluginTreatSourceRepo, MongoTreatRepo } from "./repos";

function startServer() {
  const db = connectToDB(
    `mongodb://${process.env.DB_URI}:${process.env.DB_PORT}/treats-dev`
  );
  const treatSourceRepo = new PluginTreatSourceRepo({
    moduleDirectories: [path.resolve(__dirname, "builtin_plugins")]
  });

  const treatRepo = new MongoTreatRepo({
    db
  });

  TreatsServer.start({ treatSourceRepo, treatRepo });
}

startServer();
