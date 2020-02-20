import { TreatRepo, TreatProps } from ".";
import { Treat } from "../entity";
import { DB, TreatModel } from "../db";

interface MongoTreatRepoOptions {
  db: DB;
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

    return treatModelToEntity(treat);
  }

  async all() {
    return [];
  }

  async create(props: TreatProps) {
    const treatModel = new this.options.db.Treat({
      ...props,
      _id: props.id
    });
    treatModel.save();
    return Promise.resolve(treatModelToEntity(treatModel));
  }
}

function treatModelToEntity(model: TreatModel): Treat {
  return {
    id: model._id,
    idTreatSource: model.idTreatSource,
    name: model.name,
    config: model.config
  };
}
