import { ok, error, isOk, isError } from "../types/result";
import {
  Treat,
  TreatService,
  TreatSourceService,
  NotFoundError
} from "../core";
import { logger } from "../logger";
import { UserData, UserTreat } from ".";

function createTreatId(userTreat: UserTreat) {
  return `seed_${userTreat.name}`;
}

async function mapUserTreatToTreat(
  userTreat: UserTreat,
  treatSourceService: TreatSourceService
) {
  const treatSource = await treatSourceService.get(userTreat.idTreatSource);
  if (!treatSource) {
    return error(new Error("HERE"));
  }
  return ok({
    ...userTreat,
    id: createTreatId(userTreat),
    treatSource
  });
}
export class UserDataTreatService implements TreatService {
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
    const userTreats = await UserData.readTreats();
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

  create() {
    return Promise.resolve(
      error(
        new Error("Create operation not supported for UserDataTreatService")
      )
    );
  }
}
