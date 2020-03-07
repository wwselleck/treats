import { TreatService } from "../core";
import { logger } from "../logger";
import { SeedData, SeedTreat } from "./models";

interface SeedArgs {
  data: SeedData;
  treatService: TreatService;
}

export async function seed({ data, treatService }: SeedArgs) {
  logger.info("Seeding...");
  for (const seedTreat of data.treats) {
    const idTreat = createTreatId(seedTreat);
    const treat = await treatService.get(idTreat);
    if (treat) {
      logger.info(`Skipping treat ${treat.name}, ${idTreat} already exists`);
    } else {
      logger.info(
        `Creating treat ${idTreat} from seed treat ${seedTreat.name}`
      );
      await treatService.create({
        ...seedTreat,
        id: idTreat
      });
    }
  }
  logger.info("Seeding complete");
}

function createTreatId(seedTreat: SeedTreat) {
  return `seed_${seedTreat.name}`;
}

