import { Treat } from "./treat";

export interface TreatProps {
  id?: string;
  idTreatSource: string;
  name: string;
  config: Record<string, any>;
}

export interface TreatService {
  get(id: string): Promise<Treat>;
  all(): Promise<Array<Treat>>;
  create(props: TreatProps): Promise<Treat>;
}
