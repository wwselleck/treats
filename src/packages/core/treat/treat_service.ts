import * as E from "fp-ts/lib/Either";
import { Treat } from "./treat";

export interface TreatProps {
  id?: string;
  idTreatSource: string;
  name: string;
  config: Record<string, any>;
}

export interface TreatService {
  get(id: string): Promise<E.Either<Error, Treat>>;
  all(): Promise<E.Either<Error, Array<Treat>>>;
  create(props: TreatProps): Promise<E.Either<Error, Treat>>;
}
