import { ok, error, isOk, isError, Result } from "../types/result";
import {
  Treat,
  TreatProps,
  TreatService,
  TreatSourceService,
  NotFoundError
} from "../core";
import { logger } from "../logger";
import { UserData, UserTreat } from ".";

function createTreatId(userTreat: UserTreat) {
  return `local_${userTreat.name}`;
}

async function mapUserTreatToTreat(
  userTreat: UserTreat,
  treatSourceService: TreatSourceService
): Promise<Result<Treat>> {
  const treatSource = await treatSourceService.get(userTreat.idTreatSource);
  if (isError(treatSource)) {
    return treatSource;
  }
  return ok({
    ...userTreat,
    id: createTreatId(userTreat),
    treatSource: treatSource.value
  });
}

export class UserDataTreatService implements TreatService {
  static TreatsFileName: string = "treats.json";
  constructor(private treatSourceService: TreatSourceService) {}

  async get(id: string) {
    const treats = await this.all();
    if (isError(treats)) {
      return treats;
    }
    const treat = treats.value.find(t => t.id === id);
    if (treat) {
      return ok(treat);
    } else {
      return error(new NotFoundError());
    }
  }

  async all() {
    const userTreats = (
      await UserData.readJSON(UserDataTreatService.TreatsFileName)
    ).treats;
    const treats: Array<Treat> = [];
    for (const ut of userTreats) {
      const treat = await mapUserTreatToTreat(ut, this.treatSourceService);
      if (isOk(treat)) {
        treats.push(treat.value);
      } else {
        logger.error(treat.error);
      }
    }
    return ok(treats);
  }

  async create(treatProps: TreatProps) {
    const userTreats = await UserData.readJSON(
      UserDataTreatService.TreatsFileName
    );

    const newData = {
      ...userTreats,
      treats: [...userTreats.treats, treatProps]
    };

    const treat = await mapUserTreatToTreat(
      treatProps,
      this.treatSourceService
    );

    if (isError(treat)) {
      return treat;
    }

    UserData.writeJSON(UserDataTreatService.TreatsFileName, newData);

    return ok(treat.value);
  }
}
