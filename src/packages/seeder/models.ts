export interface SeedTreat {
  name: string;
  config: Record<string, any>;
  idTreatSource: string;
}

export interface SeedData {
  treats: Array<SeedTreat>;
}

