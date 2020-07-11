import * as E from "fp-ts/lib/Either";
import { TreatSource } from ".";

export interface TreatSourceService {
  get(id: string): Promise<E.Either<Error, TreatSource>>;
  all(): Promise<E.Either<Error, Array<TreatSource>>>;
}
