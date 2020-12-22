import { Item } from "../item";

export enum TreatSourceOptionType {
  String = "String",
  Boolean = "Boolean",
}

export interface TreatSourceSetupOption {
  optionName: string;
  optionType: TreatSourceOptionType;
  isRequired: boolean;
}

export type TreatSourceSetupOptions = {
  [optionName: string]: any;
};

export interface TreatSourceConfigOption {
  optionName: string;
  optionType: TreatSourceOptionType;
  isRequired: boolean;
}

export type TreatSourceConfigOptions = {
  [optionName: string]: any;
};

export interface TreatSourceItem<InfoType = any> extends Item<InfoType> {
  idTreatSource: string;
}

export enum TreatSourceType {
  Plugin = "plugin",
}

export interface BaseTreatSource {
  id: string;
  name: string;
  setup?: TreatSourceSetupOptions;
  config?: TreatSourceConfigOptions;
  info?: any;
}

export interface PluginTreatSource extends BaseTreatSource {
  type: TreatSourceType.Plugin;
  info: {
    pluginName: string;
  };
}

export type TreatSource = PluginTreatSource;
