import {
  TreatSource,
  TreatSourceConfigOptions,
  TreatSourceConfig
} from "../core";

/**
 * These types are how the _creator_ of a plugin defines
 * the plugin. Outside of the PluginService, plugin functionality
 * will be accessed through wrapper objects.
 */

export type PluginConfig = any;

export interface PluginDefinition {
  name: string;
  treatSources: Record<string, PluginDefinitionTreatSource>;
}

export interface PluginDefinitionTreatSource {
  name: string;
  configOptions: TreatSourceConfigOptions;
  loadItems(config?: TreatSourceConfig): Promise<any>;
}
