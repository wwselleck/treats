import * as E from "fp-ts/lib/Either";
import util = require("util");
import fs = require("fs");
import path = require("path");

import { PathReporter } from "io-ts/lib/PathReporter";
import { logger } from "@treats-app/logger";

import { Plugin } from "./plugin";

// Loads and provides access to plugins that's it
interface PluginServiceOptions {
  moduleDirectories: Array<string>;
}
export class PluginService {
  private constructor(
    private options: PluginServiceOptions,
    private plugins: Record<string, Plugin>
  ) {}

  static async create(options: PluginServiceOptions) {
    const pluginPaths = await getPluginPathsFromDirectories(
      options.moduleDirectories
    );
    logger.info({ pluginPaths }, "Attempting to load plugins from paths");
    const plugins = pluginPaths
      .map((path) => {
        try {
          return loadPlugin(path);
        } catch {
          logger.error(`Could not load plugin ${path}`);
          return null;
        }
      })
      .filter((x): x is Plugin => !!x)
      .reduce((acc, curr) => {
        acc[curr.name] = curr;
        return acc;
      }, {} as Record<string, Plugin>);

    return new PluginService(options, plugins);
  }

  async get(name: string): Promise<Plugin> {
    const plugin = this.plugins[name];

    return plugin || null;
  }

  async all(): Promise<Array<Plugin>> {
    return Object.values(this.plugins);
  }
}

function loadPlugin(pluginPath: string): Plugin {
  try {
    const mod: unknown = require(pluginPath);
    const plugin = Plugin.decode(mod);
    if (E.isLeft(plugin)) {
      throw new Error(
        `Plugin ${pluginPath} provided an incorrect definition ${PathReporter.report(
          plugin
        )}`
      );
    }
    return plugin.right;
  } catch (e) {
    throw new Error(`Error requiring plugin ${pluginPath} ${e}`);
  }
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
