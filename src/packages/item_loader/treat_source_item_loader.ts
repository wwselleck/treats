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
import { logger } from "../logger";

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
      throw new Error("heeee");
    }

    if (isError(items)) {
      logger.error(
        {
          error: items.error.toString()
        },
        `Error loading items for source ${treatSource.name}`
      );
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

    if (isError(items)) {
      return items;
    }

    const itemsWithId = items.value.map(i => ({
      ...i,
      idTreatSource: treatSourceEntity.id
    }));

    return ok(itemsWithId);
  }
}
