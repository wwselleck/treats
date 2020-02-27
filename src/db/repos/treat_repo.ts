import { Treat, TreatRepo, TreatProps, TreatSourceRepo } from "../../core";
import { DB, TreatModel } from "..";

interface MongoTreatRepoOptions {
  db: DB;
  treatSourceRepo: TreatSourceRepo;
}

export class MongoTreatRepo implements TreatRepo {
  constructor(private options: MongoTreatRepoOptions) {}

  async get(id: string) {
    const treat = await this.options.db.Treat.findOne({
      _id: id
    });

    if (!treat) {
      return null;
    }

    return treatModelToEntity(treat, this.options.treatSourceRepo);
  }

  async all() {
    const treats = await this.options.db.Treat.find();
    return Promise.all(
      treats.map(treat =>
        treatModelToEntity(treat, this.options.treatSourceRepo)
      )
    );
  }

  async create(props: TreatProps) {
    const treatModel = new this.options.db.Treat({
      ...props,
      _id: props.id
    });
    treatModel.save();
    return treatModelToEntity(treatModel, this.options.treatSourceRepo);
  }
}

async function treatModelToEntity(
  model: TreatModel,
  treatSourceRepo: TreatSourceRepo
): Promise<Treat> {
  const treatSource = await treatSourceRepo.get(model.idTreatSource);
  if (!treatSource) {
    throw new Error("Invalid treatSource");
  }

  return {
    id: model._id,
    idTreatSource: model.idTreatSource,
    name: model.name,
    config: model.config,
    treatSource
  };
}
