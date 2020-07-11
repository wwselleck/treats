import { TreatSource } from "../treat_source";
import { Modifier } from "../modifier";
import { Item } from "../item";

export type TreatConfig = Record<string, any>;
export interface Treat {
  id: string;
  name: string;
  config: TreatConfig;
  treatSource: TreatSource;
  modifiers?: Array<Modifier>;
}

export interface TreatItem extends Item {
  idTreat: string;
}