import { TreatSourceSetupService } from "@treats-app/core";
import { LocalData } from ".";

export class LocalDataTreatSourceSetup implements TreatSourceSetupService {
  static SetupFileName: string = "treats-service-setup.json";
  constructor(private localData: LocalData) {}
}
