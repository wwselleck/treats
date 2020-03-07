export * from "./treat_service";

import path = require("path");
import fs = require("fs");
import util = require("util");
import { Config } from "../config";

function absolutePath(relativePath: string) {
  return path.resolve(Config.DATA_PATH, relativePath);
}

export interface UserTreat {
  name: string;
  config: Record<string, any>;
  idTreatSource: string;
}

export interface UserTreatData {
  treats: Array<UserTreat>;
}

export class UserData {
  static async readJSON(filePath: string) {
    const path = absolutePath(filePath);
    return JSON.parse(await util.promisify(fs.readFile)(path, "utf-8"));
  }

  static async writeJSON(filePath: string, obj: any) {
    const path = absolutePath(filePath);
    const data = JSON.stringify(obj, null, 2);
    return util.promisify(fs.writeFile)(path, data);
  }
}
