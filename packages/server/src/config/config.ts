import path = require("path");
import os = require("os");

export const Config = {
  LOCAL_MODE: process.env.LOCAL_MODE ? Boolean(process.env.LOCAL_MODE) : false,
  SERVER_PORT: 3218,
  DB_URI: process.env.DB_URI,
  DB_PORT: process.env.DB_PORT || 27017,
  DB_NAME: process.env.DB_NAME || "treats-dev",
  DATA_PATH: path.resolve(os.homedir(), ".treats"),
};
