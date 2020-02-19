import { TreatSource, TreatSourceType, PluginTreatSource } from "../../entity";
import { loadPluginTreatSource } from "../plugin";

export interface TreatSourceConfig {
  [optionName: string]: string | number | Array<string>;
}

export async function loadItemsFromPluginTreatSource(
  treatSource: PluginTreatSource,
  config?: TreatSourceConfig
) {
  const { pluginPath } = treatSource;

  const pluginTreatSource = loadPluginTreatSource(pluginPath);

  const items = await pluginTreatSource.loadItems(config);
  return items;
}

export async function loadItems(
  treatSource: TreatSource,
  config?: TreatSourceConfig
) {
  if (treatSource.type === TreatSourceType.Plugin) {
    return loadItemsFromPluginTreatSource(treatSource, config);
  } else {
    throw new Error();
  }
}
