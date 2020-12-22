import * as t from "io-ts";

import { TreatSourceOptionType } from "@treats-app/core";

/**
 * These types are how the _creator_ of a plugin defines
 * the plugin. Outside of the PluginService, plugin functionality
 * will be accessed through wrapper objects.
 */

const PluginTreatSourceOptionType = t.union([
  t.literal(TreatSourceOptionType.String),
  t.literal(TreatSourceOptionType.Boolean),
]);

const PluginTreatSourceSetupOption = t.intersection([
  t.type({
    optionName: t.string,
    optionType: PluginTreatSourceOptionType,
  }),
  t.partial({
    isRequired: t.union([t.boolean, t.undefined]),
  }),
]);
const PluginTreatSourceSetupOptions = t.record(
  t.string,
  PluginTreatSourceSetupOption
);

const PluginTreatSourceConfigOption = t.intersection([
  t.type({
    optionName: t.string,
    optionType: PluginTreatSourceOptionType,
  }),
  t.partial({
    isRequired: t.union([t.boolean, t.undefined]),
  }),
]);

const PluginTreatSourceConfigOptions = t.record(
  t.string,
  PluginTreatSourceConfigOption
);

const PluginTreatSource = t.intersection([
  t.type({
    name: t.string,
    loadItems: t.Function,
  }),
  t.partial({
    setup: PluginTreatSourceSetupOptions,
    config: PluginTreatSourceConfigOptions,
  }),
]);

export const Plugin = t.type({
  name: t.string,
  treatSources: t.record(t.string, PluginTreatSource),
});

export type Plugin = t.TypeOf<typeof Plugin>;

export type PluginTreatSourceSetupOptions = t.TypeOf<
  typeof PluginTreatSourceSetupOptions
>;

export type PluginTreatSourceConfigOptions = t.TypeOf<
  typeof PluginTreatSourceConfigOptions
>;

export type PluginTreatSource = t.TypeOf<typeof PluginTreatSource>;

export function getPluginTreatSource(plugin: Plugin, treatSourceName: string) {
  return plugin.treatSources[treatSourceName];
}
