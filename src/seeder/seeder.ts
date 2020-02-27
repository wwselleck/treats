import fs = require("fs");
import util = require("util");
import { TreatRepo } from "../core";
import { logger } from "../logger";
import { SeedData, SeedTreat } from "./models";

interface SeedArgs {
  data: SeedData;
  treatRepo: TreatRepo;
}

export async function seed({ data, treatRepo }: SeedArgs) {
  logger.info("Seeding...");
  for (const seedTreat of data.treats) {
    const idTreat = createTreatId(seedTreat);
    const treat = await treatRepo.get(idTreat);
    if (treat) {
      logger.info(`Skipping treat ${treat.name}, ${idTreat} already exists`);
    } else {
      logger.info(
        `Creating treat ${idTreat} from seed treat ${seedTreat.name}`
      );
      await treatRepo.create({
        ...seedTreat,
        id: idTreat
      });
    }
  }
  logger.info("Seeding complete");
}

interface SeedFromFileArgs {
  path: string;
  treatRepo: TreatRepo;
}

export async function seedFromFile({ path, treatRepo }: SeedFromFileArgs) {
  const seedJSON = JSON.parse(await util.promisify(fs.readFile)(path, "utf-8"));
  return seed({
    data: seedJSON,
    treatRepo
  });
}

function createTreatId(seedTreat: SeedTreat) {
  return `seed_${seedTreat.name}`;
}

