import {
  TreatSource,
  TreatSourceType,
  TreatSourceItem,
  TreatSourceConfig,
  PluginTreatSource
} from "../core";
import { loadPluginTreatSource } from "../plugin";

export class TreatSourceItemLoader {
  load(treatSource: TreatSource, config: TreatSourceConfig) {
    if (treatSource.type === TreatSourceType.Plugin) {
      return loadItemsFromPluginTreatSource(treatSource, config);
    } else {
      throw new Error();
    }
  }
}

export async function loadItemsFromPluginTreatSource(
  treatSource: PluginTreatSource,
  config?: TreatSourceConfig
): Promise<Array<TreatSourceItem>> {
  const { pluginPath } = treatSource;

  const pluginTreatSource = loadPluginTreatSource(pluginPath);

  const items = await pluginTreatSource.loadItems(config);
  return items;
}
