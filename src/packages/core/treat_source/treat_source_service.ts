import { Result } from "../../types/result";
import { TreatSource } from ".";

export interface TreatSourceService {
  get(id: string): Promise<Result<TreatSource>>;
  all(): Promise<Result<Array<TreatSource>>>;
}
