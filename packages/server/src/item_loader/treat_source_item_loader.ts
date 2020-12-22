import {
  TreatSource,
  TreatSourceType,
  TreatSourceItem,
  TreatSourceSetupOptions,
  TreatSourceConfigOptions,
  PluginTreatSource as PluginTreatSourceType,
  Scoreable,
} from "@treats-app/core";
import { PluginService, getPluginTreatSource } from "@treats-app/plugin";

export class TreatSourceItemLoader {
  private pluginTreatSourceItemLoader: PluginTreatSourceItemLoader;
  constructor(pluginService: PluginService) {
    this.pluginTreatSourceItemLoader = new PluginTreatSourceItemLoader(
      pluginService
    );
  }

  async load(
    treatSource: TreatSource,
    setup?: TreatSourceSetupOptions,
    config?: TreatSourceConfigOptions
  ): Promise<Array<TreatSourceItem>> {
    let items;
    if (treatSource.type === TreatSourceType.Plugin) {
      items = await this.pluginTreatSourceItemLoader.load(
        treatSource,
        setup,
        config
      );
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

export class PluginTreatSourceItemLoader {
  pluginService: PluginService;

  constructor(pluginService: PluginService) {
    this.pluginService = pluginService;
  }

  async load(
    treatSourceEntity: PluginTreatSourceType,
    setup?: TreatSourceSetupOptions,
    config?: TreatSourceConfigOptions
  ): Promise<Array<TreatSourceItem>> {
    const plugin = await this.pluginService.get(
      treatSourceEntity.info.pluginName
    );

    const treatSource = getPluginTreatSource(plugin, treatSourceEntity.name);

    const items = await treatSource.loadItems(setup, config);

    const itemsWithId = items.map((i) => ({
      ...i,
      idTreatSource: treatSourceEntity.id,
    }));

    return itemsWithId;
  }
}
