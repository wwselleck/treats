import { TreatSource, TreatSourceConfigOptions } from "../entity";
import { TreatSourceConfig } from "../services/treat_source";

export interface Plugin {
  path: string;
  TreatSource: PluginTreatSource;
}

export interface PluginModule {
  TreatSource: PluginTreatSource;
}

export interface PluginTreatSource {
  name: TreatSource["name"];
  configOptions: TreatSourceConfigOptions;
  loadItems(config?: TreatSourceConfig): Promise<any>;
}
