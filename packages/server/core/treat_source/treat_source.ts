import { Item } from "../item";

export interface TreatSourceItem<InfoType = any> extends Item<InfoType> {
  idTreatSource: string;
}

export enum TreatSourceType {
  Plugin = "plugin",
}

export interface TreatSourceConfig {
  [optionName: string]: any;
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
  Boolean = "Boolean",
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
