import { TreatSource } from "../treat_source";

export type TreatConfig = Record<string, any>;
export interface Treat {
  id: string;
  idTreatSource: string;
  name: string;
  config: TreatConfig;
  treatSource: TreatSource;
}

export interface TreatItem {
  id: string;
  idTreat: string;
  title: string;
  description?: string;
  link?: string;
  score: number;
}
