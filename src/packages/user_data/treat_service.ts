import * as E from "fp-ts/lib/Either";
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
): Promise<E.Either<Error, Treat>> {
  const treatSource = await treatSourceService.get(userTreat.idTreatSource);
  if (E.isLeft(treatSource)) {
    return treatSource;
  }
  return E.right({
    ...userTreat,
    id: createTreatId(userTreat),
    treatSource: treatSource.right,
  });
}

export class UserDataTreatService implements TreatService {
  static TreatsFileName: string = "treats.json";
  constructor(private treatSourceService: TreatSourceService) {}

  async get(id: string) {
    const treats = await this.all();
    if (E.isLeft(treats)) {
      return treats;
    }
    const treat = treats.right.find((t) => t.id === id);
    if (treat) {
      return E.right(treat);
    } else {
      return E.left(new NotFoundError());
    }
  }

  async all() {
    const userTreats = (
      await UserData.readJSON(UserDataTreatService.TreatsFileName)
    ).treats;
    const treats: Array<Treat> = [];
    for (const ut of userTreats) {
      const treat = await mapUserTreatToTreat(ut, this.treatSourceService);
      if (E.isRight(treat)) {
        treats.push(treat.right);
      } else {
        logger.error(treat.left);
      }
    }
    return E.right(treats);
  }

  async create(treatProps: TreatProps): Promise<E.Either<Error, Treat>> {
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

    if (E.isLeft(treat)) {
      return treat;
    }

    UserData.writeJSON(UserDataTreatService.TreatsFileName, newData);

    return treat;
  }
}
