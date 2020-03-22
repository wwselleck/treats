import { Item } from "../item";

export interface TreatSourceItem extends Item {
  idTreatSource: string;
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
  isRequired?: boolean;
}

export enum TreatSourceConfigOptionType {
  String = "String",
  Boolean = "Boolean"
}

export interface BaseTreatSource {
  id: string;
  name: string;
  configOptions?: TreatSourceConfigOptions;
  info?: any;
}

export interface PluginTreatSource extends BaseTreatSource {
  type: TreatSourceType.Plugin;
  info: {
    pluginName: string;
  };
}

export type TreatSource = PluginTreatSource;
