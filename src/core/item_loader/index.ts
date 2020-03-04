import { loadPluginTreatSource } from "../../plugin";
import { Treat, TreatItem } from "../treat";
import {
  TreatSource,
  TreatSourceType,
  PluginTreatSource,
  TreatSourceItem,
  TreatSourceConfig
} from "../treat_source";

export class TreatItemLoader {
  async load(treat: Treat): Promise<Array<TreatItem>> {
    const { treatSource, config } = treat;

    if (treatSource.type === TreatSourceType.Plugin) {
      let treatSourceItems = await loadItemsFromPluginTreatSource(
        treatSource,
        config
      );
      return treatSourceItems.map(i => treatItemFromTreatSourceItem(treat, i));
    } else {
      throw new Error();
    }
  }
}

function treatItemFromTreatSourceItem(
  treat: Treat,
  treatSourceItem: TreatSourceItem
): TreatItem {
  return {
    ...treatSourceItem,
    idTreat: treat.id
  };
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
