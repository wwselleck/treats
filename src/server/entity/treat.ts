import { TreatSource } from "./treat_source";

export interface Treat {
  id: string;
  idTreatSource: string;
  name: string;
  config: Map<string, any>;
  treatSource: TreatSource;
}
