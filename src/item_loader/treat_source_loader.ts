import {
  TreatSource,
  TreatSourceType,
  TreatSourceConfig,
  TreatSourceItemLoader,
  PluginTreatSource
} from "../core";
import { loadPluginTreatSource } from "../plugin";

export async function loadItemsFromPluginTreatSource(
  treatSource: PluginTreatSource,
  config?: TreatSourceConfig
) {
  const { pluginPath } = treatSource;

  const pluginTreatSource = loadPluginTreatSource(pluginPath);

  const items = await pluginTreatSource.loadItems(config);
  return items;
}

export class BasicTreatSourceItemLoader implements TreatSourceItemLoader {
  load(treatSource: TreatSource, config: TreatSourceConfig) {
    if (treatSource.type === TreatSourceType.Plugin) {
      return loadItemsFromPluginTreatSource(treatSource, config);
    } else {
      throw new Error();
    }
  }
}
