import { TreatSource } from ".";

export interface TreatSourceService {
  get(id: string): Promise<TreatSource>;
  all(): Promise<Array<TreatSource>>;
}
