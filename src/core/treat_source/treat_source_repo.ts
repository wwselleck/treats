import { TreatSource } from ".";

export interface TreatSourceRepo {
  get(id: string): Promise<TreatSource | null>;
  all(): Promise<Array<TreatSource>>;
}
