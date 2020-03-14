import * as t from "io-ts";

import { TreatSourceConfigOptionType } from "../core";

/**
 * These types are how the _creator_ of a plugin defines
 * the plugin. Outside of the PluginService, plugin functionality
 * will be accessed through wrapper objects.
 */
const PluginDefinitionTreatSourceConfigOptionType = t.union([
  t.literal(TreatSourceConfigOptionType.String),
  t.literal(TreatSourceConfigOptionType.Boolean)
]);

const PluginDefinitionTreatSourceConfigOption = t.intersection([
  t.type({
    optionName: t.string,
    optionType: PluginDefinitionTreatSourceConfigOptionType
  }),
  t.partial({
    isRequired: t.union([t.boolean, t.undefined])
  })
]);

const PluginDefinitionTreatSourceConfigOptions = t.record(
  t.string,
  PluginDefinitionTreatSourceConfigOption
);

const PluginDefinitionTreatSource = t.type({
  name: t.string,
  configOptions: PluginDefinitionTreatSourceConfigOptions,
  loadItems: t.Function
});

export const PluginDefinition = t.type({
  name: t.string,
  treatSources: t.record(t.string, PluginDefinitionTreatSource)
});

export type PluginConfig = any;

export type PluginDefinition = t.TypeOf<typeof PluginDefinition>;

export type PluginDefinitionTreatSource = t.TypeOf<
  typeof PluginDefinitionTreatSource
>;
