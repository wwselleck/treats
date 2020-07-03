import * as E from "fp-ts/lib/Either";
import {
  TreatSource,
  TreatSourceType,
  TreatSourceItem,
  TreatSourceConfig,
  PluginTreatSource as PluginTreatSourceType,
  Scoreable,
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
  ): Promise<E.Either<Error, Array<TreatSourceItem>>> {
    let items;
    if (treatSource.type === TreatSourceType.Plugin) {
      items = await new PluginTreatSourceItemLoader(this.pluginService).load(
        treatSource,
        config
      );
    } else {
      throw new Error("heeee");
    }

    if (E.isLeft(items)) {
      logger.error(
        {
          error: items.left.toString(),
        },
        `Error loading items for source ${treatSource.name}`
      );
      return items;
    }
    return E.right(items.right.map(roundScore));
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
  ): Promise<E.Either<Error, Array<TreatSourceItem>>> {
    const plugin = await this.pluginService.get(
      treatSourceEntity.info.pluginName
    );

    if (E.isLeft(plugin)) {
      return plugin;
    }

    const treatSource = plugin.right.treatSource(treatSourceEntity.name);

    if (E.isLeft(treatSource)) {
      return treatSource;
    }

    const items = await treatSource.right.loadItems(config);

    if (E.isLeft(items)) {
      return items;
    }

    const itemsWithId = items.right.map((i) => ({
      ...i,
      idTreatSource: treatSourceEntity.id,
    }));

    return E.right(itemsWithId);
  }
}
