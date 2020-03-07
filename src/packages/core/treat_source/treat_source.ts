export interface TreatSourceItem {
  id: string;
  idTreatSource: string;
  title: string;
  description?: string;
  link?: string;
  score: number;
}

export enum TreatSourceType {
  Plugin = "plugin"
}

export interface TreatSourceConfig {
  [optionName: string]: string | number | Array<string>;
}

export type TreatSourceConfigOptions = {
  [optionName: string]: TreatSourceConfigOption;
};

export interface TreatSourceConfigOption {
  optionName: string;
  optionType: TreatSourceConfigOptionType;
  isRequired: boolean;
}

export enum TreatSourceConfigOptionType {
  String = "String",
  Boolean = "Boolean"
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
