import { Plugin, PluginTreatSource } from "../plugin";

export function loadPlugin(pluginPath: string): Plugin {
  try {
    return {
      path: pluginPath,
      ...require(pluginPath)
    };
  } catch (e) {
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
