import { logger } from "../../logger";
import { TreatRepo, TreatSourceRepo } from "../repos";

interface SeedTreat {
  name: string;
  config: Map<string, any>;
  idTreatSource: string;
}

export interface TreatsServerSeed {
  treats: Array<SeedTreat>;
}

interface SeedArgs {
  seed: TreatsServerSeed;
  treatRepo: TreatRepo;
  treatSourceRepo: TreatSourceRepo;
}

export async function seed({ seed: _seed, treatRepo }: SeedArgs) {
  logger.info("Seeding...");
  for (const seedTreat of _seed.treats) {
    const idTreat = createTreatId(seedTreat);
    const treat = await treatRepo.get(idTreat);
    if (treat) {
      logger.info(`Skipping treat ${treat.name}, ${idTreat} already exists`);
    } else {
      await treatRepo.create({
        id: idTreat,
        ...seedTreat
      });
    }
  }
  logger.info("Seeding complete");
}

function createTreatId(seedTreat: SeedTreat) {
  return `seed_${seedTreat.name}`;
}
