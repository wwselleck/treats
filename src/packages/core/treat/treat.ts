import { TreatSource } from "../treat_source";
import { Item } from "../item";

export type TreatConfig = Record<string, any>;
export interface Treat {
  id: string;
  idTreatSource: string;
  name: string;
  config: TreatConfig;
  treatSource: TreatSource;
}

export interface TreatItem extends Item {
  idTreat: string;
}
