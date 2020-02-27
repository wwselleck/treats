import { TreatSource } from "../treat_source";

export interface Treat {
  id: string;
  idTreatSource: string;
  name: string;
  config: Record<string, any>;
  treatSource: TreatSource;
}

export interface TreatItem {
  id: string;
  idTreat: string;
  title: string;
  description?: string;
  link?: string;
}
