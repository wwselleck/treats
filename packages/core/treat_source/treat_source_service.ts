import { TreatSource } from ".";

export interface TreatSourceService {
  get(id: string): Promise<TreatSource | null>;
  all(): Promise<Array<TreatSource>>;
}
