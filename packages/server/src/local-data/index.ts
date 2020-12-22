export * from "./treat-service";

import path = require("path");
import fs = require("fs");
import util = require("util");
import { Modifier } from "@treats-app/core";

function absolutePath(dataPath: string, relativePath: string) {
  return path.resolve(dataPath, relativePath);
}

export interface LocalTreat {
  name: string;
  config: Record<string, any>;
  idTreatSource: string;
  modifiers?: Array<Modifier>;
}

export interface LocalTreatData {
  treats: Array<LocalTreat>;
}

export class LocalData {
  constructor(private dataPath: string) {}
  async readJSON(filePath: string) {
    const path = absolutePath(this.dataPath, filePath);
    return JSON.parse(await util.promisify(fs.readFile)(path, "utf-8"));
  }

  async writeJSON(filePath: string, obj: any) {
    const path = absolutePath(this.dataPath, filePath);
    const data = JSON.stringify(obj, null, 2);
    return util.promisify(fs.writeFile)(path, data);
  }

  async readJS(filePath: string) {
    const path = absolutePath(this.dataPath, filePath);
    return require(path);
  }
}
