import { Treat } from ".";

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
