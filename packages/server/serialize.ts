import {
  Treat,
  TreatItem,
  TreatSource,
  TreatSourceType,
  TreatSourceConfigOptions,
} from "./core";

export interface SerializedTreat {
  id: string;
  name: string;
  config: Record<string, any> | null;
  treatSource: SerializedTreatSource;
}

export interface SerializedTreatInput {
  idTreatSource: string;
  name: string;
  config: Record<string, any> | null;
}

export interface SerializedTreatSource {
  id: string;
  type: TreatSourceType;
  name: string;
  configOptions?: TreatSourceConfigOptions;
}

export interface SerializedTreatItem {
  id: string;
  idTreat: string;
  title: string;
  score: number;
  description?: string;
  link?: string;
  treat: Pick<SerializedTreat, "name">;
}

export function serializeTreat(treat: Treat): SerializedTreat {
  return {
    id: treat.id,
    name: treat.name,
    config: treat.config,
    treatSource: serializeTreatSource(treat.treatSource),
  };
}

export function serializeTreatItem(
  item: TreatItem,
  treat: Treat
): SerializedTreatItem {
  return {
    id: item.id,
    idTreat: item.idTreat,
    title: item.title,
    description: item.description,
    score: item.score,
    link: item.link,
    treat: {
      name: treat.name,
    },
  };
}

export function serializeTreatSource(
  source: TreatSource
): SerializedTreatSource {
  return {
    id: source.id,
    type: source.type,
    name: source.name,
    configOptions: source.configOptions,
  };
}
