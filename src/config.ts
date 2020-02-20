import path = require("path");
import os = require("os");

export const Config = {
  DB_URI: process.env.DB_URI,
  DB_PORT: process.env.DB_PORT || 27017,
  DATA_PATH: path.resolve(os.homedir(), ".treats"),
  SEED_FILE_NAME: "treats_seed.json"
};
