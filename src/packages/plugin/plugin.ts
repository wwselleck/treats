import { Result, ok, error, isError } from "../types/result";
import { TreatSourceConfigOptions, TreatSourceConfig } from "../core";
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

    return ok(new PluginTreatSource(def));
  }

  treatSources(): Array<PluginTreatSource> {
    return Object.values<PluginDefinitionTreatSource>(
      this.modPlugin.treatSources
    ).map((tsd: PluginDefinitionTreatSource) => new PluginTreatSource(tsd));
  }
}

export class PluginTreatSource {
  private definition: PluginDefinitionTreatSource;
  name: string;
  configOptions: TreatSourceConfigOptions;

  constructor(definition: PluginDefinitionTreatSource) {
    this.definition = definition;

    const { name, configOptions } = definition;
    this.name = name;
    this.configOptions = configOptions;
  }

  async loadItems(config?: TreatSourceConfig) {
    return Promise.resolve([]);
  }
}
