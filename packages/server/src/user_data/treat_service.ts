import {
  Treat,
  TreatProps,
  TreatService,
  NotFoundError,
} from "@treats-app/core";
import { logger } from "../logger";
import { UserData, UserTreat } from ".";

function createTreatId(userTreat: UserTreat) {
  return `local_${userTreat.name}`;
}

async function mapUserTreatToTreat(userTreat: UserTreat): Promise<Treat> {
  return {
    ...userTreat,
    id: createTreatId(userTreat),
  };
}

export class UserDataTreatService implements TreatService {
  static TreatsFileName: string = "treats.json";
  constructor() {}

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
    const userTreats = (
      await UserData.readJSON(UserDataTreatService.TreatsFileName)
    ).treats;
    const treats: Array<Treat> = [];
    for (const ut of userTreats) {
      const treat = await mapUserTreatToTreat(ut);
      if (treat) {
        treats.push(treat);
      } else {
        logger.error(treat);
      }
    }
    return treats;
  }

  async create(treatProps: TreatProps): Promise<Treat> {
    const userTreats = await UserData.readJSON(
      UserDataTreatService.TreatsFileName
    );

    const newData = {
      ...userTreats,
      treats: [...userTreats.treats, treatProps],
    };


    await UserData.writeJSON(UserDataTreatService.TreatsFileName, newData);

    const treat = await mapUserTreatToTreat(treatProps);

    return treat;
  }
}
