import {
  TreatSource,
  TreatSourceConfigOptions,
  TreatSourceConfig
} from "../core";

export interface Plugin {
  path: string;
  TreatSource: PluginTreatSource;
}

export interface PluginModule {
  TreatSource: PluginTreatSource;
}

export interface PluginTreatSource {
  name: TreatSource["name"];
  configOptions: TreatSourceConfigOptions;
  loadItems(config?: TreatSourceConfig): Promise<any>;
}

export function loadPlugin(pluginPath: string): Plugin {
  try {
    return {
      path: pluginPath,
      ...require(pluginPath)
    };
  } catch (e) {
    console.log(e);
    throw new Error(`Error requiring plugin ${pluginPath} ${e}`);
  }
}

export function loadPluginTreatSource(pluginPath: string): PluginTreatSource {
  const plugin = loadPlugin(pluginPath);
  return plugin.TreatSource;
}

/*
 * Returns whether or not fileName is a valid file name for a
 * Treats plugin
 */
export function isPluginFileName(fileName: string) {
  return fileName.endsWith(".js");
}
