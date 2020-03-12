import { Result, ok, isError } from "../types/result";
import {
  TreatSource,
  TreatSourceType,
  TreatSourceItem,
  TreatSourceConfig,
  PluginTreatSource as PluginTreatSourceType
} from "../core";
import { PluginService, PluginTreatSource } from "../plugin";

export class TreatSourceItemLoader {
  pluginService: PluginService;
  constructor(pluginService: PluginService) {
    this.pluginService = pluginService;
  }

  load(
    treatSource: TreatSource,
    config: TreatSourceConfig
  ): Promise<Result<Array<TreatSourceItem>>> {
    if (treatSource.type === TreatSourceType.Plugin) {
      return new PluginTreatSourceItemLoader(this.pluginService).load(
        treatSource,
        config
      );
    } else {
      throw new Error();
    }
  }
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
