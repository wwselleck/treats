import util = require("util");
import fs = require("fs");
import path = require("path");

import { PathReporter } from "io-ts/lib/PathReporter";
import { isLeft } from "fp-ts/lib/Either";

import { logger } from "../logger";
import { Result, ok, error, isOk } from "../types/result";
import { UserData } from "../user_data";
import { PluginDefinition, PluginConfig } from "./plugin_definition";
import { Plugin } from "./plugin";

// Loads and provides access to plugins
// that's it
interface PluginServiceOptions {
  moduleDirectories: Array<string>;
}
export class PluginService {
  private constructor(
    private options: PluginServiceOptions,
    private plugins: Record<string, Plugin>,
    private configs: Record<string, any>
  ) {}

  static async create(options: PluginServiceOptions) {
    const pluginPaths = await getPluginPathsFromDirectories(
      options.moduleDirectories
    );
    logger.info({ pluginPaths }, "Attempting to load plugins from paths");
    const pluginDefinitions = pluginPaths
      .map(loadPluginDefinition)
      .reduce((acc, curr) => {
        if (isOk(curr)) {
          acc.push(curr.value);
        } else {
          logger.warn(`Could not load plugin definition ${curr.error}`);
        }
        return acc;
      }, [] as Array<PluginDefinition>);

    const configs = await loadPluginConfigs();
    const plugins = await createPluginInstances(pluginDefinitions, configs);

    return new PluginService(options, plugins, configs);
  }

  async get(name: string): Promise<Result<Plugin>> {
    const plugin = this.plugins[name];

    if (!plugin) {
      return error(new Error(`Plugin not found ${name}`));
    }

    return ok(plugin);
  }

  async all(): Promise<Result<Array<Plugin>>> {
    return ok(Object.values(this.plugins));
  }
}

function loadPluginDefinition(pluginPath: string): Result<PluginDefinition> {
  try {
    const mod: unknown = require(pluginPath);
    const pluginDefinition = PluginDefinition.decode(mod);
    if (isLeft(pluginDefinition)) {
      return error(
        new Error(
          `Plugin ${pluginPath} provided an incorrect definition ${PathReporter.report(
            pluginDefinition
          )}`
        )
      );
    }
    return ok(pluginDefinition.right);
  } catch (e) {
    throw new Error(`Error requiring plugin ${pluginPath} ${e}`);
  }
}

function loadPluginConfigs(): Record<string, PluginConfig> {
  const mod = UserData.readJS("plugin_config.js");
  return mod;
}

async function createPluginInstances(
  pluginsDefinitions: Array<PluginDefinition>,
  configs: Record<string, PluginConfig>
) {
  return pluginsDefinitions
    .map((mp) => {
      const config = configs[mp.name];
      return new Plugin(mp, config);
    })
    .reduce((acc, curr: Plugin) => {
      acc[curr.name] = curr;
      return acc;
    }, {} as Record<string, Plugin>);
}

async function getPluginPathsFromDirectory(directoryPath: string) {
  let possiblePluginFileNames;
  try {
    possiblePluginFileNames = await getFiles(directoryPath);
  } catch (e) {
    throw new Error(`Invalid module directory ${directoryPath}`);
  }

  return possiblePluginFileNames
    .filter(isPluginFileName)
    .map((f) => path.resolve(directoryPath, f));
}

async function getPluginPathsFromDirectories(directoryPaths: Array<string>) {
  let pluginPaths: Array<string> = [];
  for (let moduleDirectory of directoryPaths) {
    let paths = await getPluginPathsFromDirectory(moduleDirectory);
    pluginPaths = pluginPaths.concat(paths);
  }
  return pluginPaths;
}

/*
 * Returns whether or not fileName is a valid file name for a
 * Treats plugin
 */
export function isPluginFileName(fileName: string) {
  return fileName.endsWith("plugin.js");
}

// https://stackoverflow.com/questions/5827612/node-js-fs-readdir-recursive-directory-search
async function getFiles(dir: string): Promise<Array<string>> {
  const dirents = await util.promisify(fs.readdir)(dir, {
    withFileTypes: true,
  });

  const files = [];
  for (let ent of dirents) {
    const res = path.resolve(dir, ent.name);
    if (ent.isDirectory()) {
      files.push(...(await getFiles(res)));
    } else {
      files.push(res);
    }
  }
  return files;
}
