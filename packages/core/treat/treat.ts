import { TreatSource } from "../treat_source";
import { Modifier } from "../modifier";
import { Item } from "../item";

export type TreatConfig = Record<string, any>;
export interface Treat {
  id: string;
  idTreatSource: string;
  name: string;
  config: TreatConfig;
  modifiers?: Array<Modifier>;
}

export interface TreatItem extends Item {
  idTreat: string;
}
