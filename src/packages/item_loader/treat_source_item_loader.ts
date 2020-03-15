import { Result, ok, isError } from "../types/result";
import {
  TreatSource,
  TreatSourceType,
  TreatSourceItem,
  TreatSourceConfig,
  PluginTreatSource as PluginTreatSourceType,
  Scoreable
} from "../core";
import { PluginService } from "../plugin";

export class TreatSourceItemLoader {
  pluginService: PluginService;
  constructor(pluginService: PluginService) {
    this.pluginService = pluginService;
  }

  async load(
    treatSource: TreatSource,
    config: TreatSourceConfig
  ): Promise<Result<Array<TreatSourceItem>>> {
    let items;
    if (treatSource.type === TreatSourceType.Plugin) {
      items = await new PluginTreatSourceItemLoader(this.pluginService).load(
        treatSource,
        config
      );
    } else {
      throw new Error();
    }

    if (isError(items)) {
      return items;
    }
    return ok(items.value.map(roundScore));
  }
}

function roundScore<T extends Scoreable>(i: T): T {
  return {
    ...i,
    score: Math.round(i.score)
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
  ): Promise<Result<Array<TreatSourceItem>>> {
    const plugin = await this.pluginService.get(
      treatSourceEntity.info.pluginName
    );

    if (isError(plugin)) {
      return plugin;
    }

    const treatSource = plugin.value.treatSource(treatSourceEntity.name);

    if (isError(treatSource)) {
      return treatSource;
    }

    const items = await treatSource.value.loadItems(config);
    return ok(items);
  }
}
