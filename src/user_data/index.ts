import path = require("path");
import { Config } from "../config";

export function getPaths() {
  return {
    seed: path.resolve(Config.DATA_PATH, Config.SEED_FILE_NAME)
  };
}
