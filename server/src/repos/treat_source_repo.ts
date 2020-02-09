import util = require("util");
import fs = require("fs");
import path = require("path");
import { TreatSourceRepo } from ".";
import { PluginTreatSource, TreatSourceType } from "../entity";
import { Plugin } from "../plugin";
import * as PluginService from "../services/plugin";

export function treatSourceFromPlugin(plugin: Plugin): PluginTreatSource {
  return {
    id: path.basename(plugin.path, ".js"),
    name: plugin.TreatSource.name,
    configOptions: plugin.TreatSource.configOptions,
    type: TreatSourceType.Plugin,
    pluginPath: plugin.path
  };
}

async function getPluginPathsFromDirectory(directoryPath: string) {
  let possiblePluginFileNames;
  try {
    possiblePluginFileNames = await util.promisify(fs.readdir)(directoryPath);
  } catch (e) {
    throw new Error(`Invalid module directory ${directoryPath}`);
  }

  return possiblePluginFileNames
    .filter(PluginService.isPluginFileName)
    .map(f => path.resolve(directoryPath, f));
}

async function getPluginPathsFromDirectories(directoryPaths: Array<string>) {
  let pluginPaths: Array<string> = [];
  for (let moduleDirectory of directoryPaths) {
    let paths = await getPluginPathsFromDirectory(moduleDirectory);
    pluginPaths = pluginPaths.concat(paths);
  }
  return pluginPaths;
}

interface PluginTreatSourceRepoOptions {
  moduleDirectories: Array<string>;
}

export class PluginTreatSourceRepo implements TreatSourceRepo {
  options: PluginTreatSourceRepoOptions;
  constructor(options: PluginTreatSourceRepoOptions) {
    this.options = options;
  }

  async get(id: string) {
    const pluginPaths = await getPluginPathsFromDirectories(
      this.options.moduleDirectories
    );
    for (let pluginPath of pluginPaths) {
      const fileName = path.basename(pluginPath, ".js");
      if (fileName === id) {
        return Promise.resolve(
          treatSourceFromPlugin(PluginService.loadPlugin(pluginPath))
        );
      }
    }
    return null;
  }

  async all() {
    const pluginPaths = await getPluginPathsFromDirectories(
      this.options.moduleDirectories
    );
    let plugins = pluginPaths.map(PluginService.loadPlugin);
    return plugins.map(treatSourceFromPlugin);
  }
}
