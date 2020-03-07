import { Result } from "../../types/result";
import { Treat } from "./treat";

export interface TreatProps {
  id?: string;
  idTreatSource: string;
  name: string;
  config: Record<string, any>;
}

export interface TreatService {
  get(id: string): Promise<Result<Treat>>;
  all(): Promise<Result<Array<Treat>>>;
  create(props: TreatProps): Promise<Result<Treat>>;
}
