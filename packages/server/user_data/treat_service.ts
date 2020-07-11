import {
  Treat,
  TreatProps,
  TreatService,
  TreatSourceService,
  NotFoundError,
} from "../core";
import { logger } from "../logger";
import { UserData, UserTreat } from ".";

function createTreatId(userTreat: UserTreat) {
  return `local_${userTreat.name}`;
}

async function mapUserTreatToTreat(
  userTreat: UserTreat,
  treatSourceService: TreatSourceService
): Promise<Treat> {
  const treatSource = await treatSourceService.get(userTreat.idTreatSource);
  return {
    ...userTreat,
    id: createTreatId(userTreat),
    treatSource: treatSource,
  };
}

export class UserDataTreatService implements TreatService {
  static TreatsFileName: string = "treats.json";
  constructor(private treatSourceService: TreatSourceService) {}

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
      const treat = await mapUserTreatToTreat(ut, this.treatSourceService);
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

    const treat = await mapUserTreatToTreat(
      treatProps,
      this.treatSourceService
    );

    if (treat) {
      return treat;
    }

    UserData.writeJSON(UserDataTreatService.TreatsFileName, newData);

    return treat;
  }
}
