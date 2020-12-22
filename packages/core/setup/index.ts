import { Treat } from "..";

export interface Setup {
  id: string;
  idTreatSource: string;
  setup: any;
}

export interface SetupService {
  getForTreat(treat: Treat): Setup;
}
