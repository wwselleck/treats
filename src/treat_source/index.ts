export { ExampleTreatSource } from "./example_treat_source";

export interface TreatSource {
  id: string;
  name: string;
  items(): Promise<Array<TreatSourceItem>>;
}

export interface TreatSourceItem {
  id: string;
  idTreatSource: string;
  title: string;
  score: number;
  description?: string;
  link?: string;
  info?: Object;
}
