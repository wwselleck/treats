import { Result, ok, error, isError } from "../types/result";
import {
  TreatSourceConfigOptions,
  TreatSourceConfig,
  TreatSourceItem
} from "../core";
import {
  PluginDefinition,
  PluginDefinitionTreatSource,
  PluginConfig
} from "./plugin_definition";

export class Plugin {
  name: string;

  constructor(
    private modPlugin: PluginDefinition,
    private config?: PluginConfig
  ) {
    const { name } = modPlugin;
    this.name = name;
  }

  treatSource(name: string): Result<PluginTreatSource> {
    const def = this.modPlugin.treatSources[name];
    if (!def) {
      return error(
        new Error(
          `Plugin ${this.name} does not contain treatSource with name ${name}`
        )
      );
    }

    return ok(new PluginTreatSource(def, this.config));
  }

  treatSources(): Array<PluginTreatSource> {
    return Object.values<PluginDefinitionTreatSource>(
      this.modPlugin.treatSources
    ).map(
      (tsd: PluginDefinitionTreatSource) =>
        new PluginTreatSource(tsd, this.config)
    );
  }
}

export class PluginTreatSource {
  private definition: PluginDefinitionTreatSource;
  private pluginConfig: PluginConfig;

  name: string;
  configOptions: TreatSourceConfigOptions;

  constructor(
    definition: PluginDefinitionTreatSource,
    pluginConfig: PluginConfig
  ) {
    this.definition = definition;
    this.pluginConfig = pluginConfig;

    const { name, configOptions } = definition;
    this.name = name;
    this.configOptions = configOptions;
  }

  async loadItems(
    config?: TreatSourceConfig
  ): Promise<Result<Array<TreatSourceItem>>> {
    const _loadItems = this.definition.loadItems;
    try {
      const items = await _loadItems(config, this.pluginConfig);
      return ok(items);
    } catch (e) {
      console.log("hhhhhh");
      console.log(e);
      return error(e);
    }
  }
}
