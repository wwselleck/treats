import path = require("path");
import fs = require("fs");
import util = require("util");
import { Config } from "../config";

export function getPaths() {
  return {
    seed: path.resolve(Config.DATA_PATH, Config.SEED_FILE_NAME)
  };
}

function absolutePath(relativePath: string) {
  return path.resolve(Config.DATA_PATH, relativePath);
}

export class UserData {
  static readFile(filePath: string) {
    const path = absolutePath(filePath);
    return util.promisify(fs.readFile)(path, "utf-8");
  }
}
