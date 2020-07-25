import {
  TreatSource,
  TreatSourceType,
  TreatSourceItem,
  TreatSourceConfig,
  PluginTreatSource as PluginTreatSourceType,
  Scoreable,
} from "@treats-app/core";
import { PluginService } from "../plugin";

export class TreatSourceItemLoader {
  pluginService: PluginService;
  constructor(pluginService: PluginService) {
    this.pluginService = pluginService;
  }

  async load(
    treatSource: TreatSource,
    config: TreatSourceConfig
  ): Promise<Array<TreatSourceItem>> {
    let items;
    if (treatSource.type === TreatSourceType.Plugin) {
      const loader = new PluginTreatSourceItemLoader(this.pluginService);
      items = await loader.load(treatSource, config);
    } else {
      throw new Error("heeee");
    }

    return items.map(roundScore);
  }
}

function roundScore<T extends Scoreable>(i: T): T {
  return {
    ...i,
    score: Math.round(i.score),
  };
}

class PluginTreatSourceItemLoader {
  pluginService: PluginService;

  constructor(pluginService: PluginService) {
    this.pluginService = pluginService;
  }

  async load(
    treatSourceEntity: PluginTreatSourceType,
    config?: TreatSourceConfig
  ): Promise<Array<TreatSourceItem>> {
    const plugin = await this.pluginService.get(
      treatSourceEntity.info.pluginName
    );

    const treatSource = plugin.treatSource(treatSourceEntity.name);

    const items = await treatSource.loadItems(config);

    const itemsWithId = items.map((i) => ({
      ...i,
      idTreatSource: treatSourceEntity.id,
    }));

    return itemsWithId;
  }
}
