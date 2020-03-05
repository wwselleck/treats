import { Treat } from "../core";

export function serializeTreat(treat: Treat) {
  return {
    id: treat.id,
    idTreatSource: treat.idTreatSource,
    name: treat.name,
    config: treat.config
  };
}
