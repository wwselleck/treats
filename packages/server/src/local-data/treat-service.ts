import {
  Treat,
  TreatProps,
  TreatService,
  NotFoundError,
} from "@treats-app/core";
import { logger } from "@treats-app/logger";
import { LocalData, LocalTreat } from ".";

function createTreatId(localTreat: LocalTreat) {
  return `local_${localTreat.name}`;
}

async function mapLocalTreatToTreat(localTreat: LocalTreat): Promise<Treat> {
  return {
    ...localTreat,
    id: createTreatId(localTreat),
  };
}

export class LocalDataTreatService implements TreatService {
  static TreatsFileName: string = "treats.json";
  constructor(private localData: LocalData) {}

  async get(id: string) {
    const treats = await this.all();
    const treat = treats.find((t) => t.id === id);
    if (treat) {
      return treat;
    } else {
      throw new NotFoundError();
    }
  }

  async all() {
    const localTreats = (
      await this.localData.readJSON(LocalDataTreatService.TreatsFileName)
    ).treats;
    const treats: Array<Treat> = [];
    for (const lt of localTreats) {
      const treat = await mapLocalTreatToTreat(lt);
      if (treat) {
        treats.push(treat);
      } else {
        logger.error(treat);
      }
    }
    return treats;
  }

  async create(treatProps: TreatProps): Promise<Treat> {
    const localTreats = await this.localData.readJSON(
      LocalDataTreatService.TreatsFileName
    );

    console.log("Curr treats");
    console.log(localTreats);

    const newData = {
      ...localTreats,
      treats: [...localTreats.treats, treatProps],
    };

    console.log("New treats");
    console.log(newData);

    await this.localData.writeJSON(
      LocalDataTreatService.TreatsFileName,
      newData
    );

    const treat = await mapLocalTreatToTreat(treatProps);

    return treat;
  }
}
