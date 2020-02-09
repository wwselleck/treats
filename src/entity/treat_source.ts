export enum TreatSourceType {
  Plugin = "plugin"
}

export type TreatSourceConfigOptions = {
  [optionName: string]: TreatSourceConfigOption;
};

export interface TreatSourceConfigOption {
  optionName: string;
  optionType: TreatSourceConfigOptionType;
  isRequired: boolean;
}

export const enum TreatSourceConfigOptionType {
  String = "String"
}

export interface BaseTreatSource {
  id: string;
  name: string;
  configOptions?: TreatSourceConfigOptions;
}

export interface PluginTreatSource extends BaseTreatSource {
  type: TreatSourceType.Plugin;
  pluginPath: string;
}

export type TreatSource = PluginTreatSource;

