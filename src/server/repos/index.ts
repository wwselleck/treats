export * from "./treat_source_repo";
export * from "./treat_repo";

import { Treat, TreatSource } from "../entity";

export interface TreatSourceRepo {
  get(id: string): Promise<TreatSource | null>;
  all(): Promise<Array<TreatSource>>;
}

export interface TreatProps {
  id?: string;
  idTreatSource: string;
  name: string;
  config: Record<string, any>;
}

export interface TreatRepo {
  get(id: string): Promise<Treat | null>;
  all(): Promise<Array<Treat>>;
  create(props: TreatProps): Promise<Treat>;
}
