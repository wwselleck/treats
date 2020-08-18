import {
  Treat,
  TreatService,
  TreatProps,
  NotFoundError,
} from "@treats-app/core";
import { DB, TreatModel } from "..";

interface MongoTreatServiceOptions {
  db: DB;
}

export class MongoTreatService implements TreatService {
  constructor(private options: MongoTreatServiceOptions) {}

  async get(id: string) {
    const treat = await this.options.db.Treat.findOne({
      _id: id,
    });

    if (!treat) {
      throw new NotFoundError();
    }

    const treatEntity = await treatModelToEntity(treat);

    return treatEntity;
  }

  async all() {
    const treats = await this.options.db.Treat.find();

    const treatEntities = [];
    for (const treat of treats) {
      const treatEntity = await treatModelToEntity(treat);
      treatEntities.push(treatEntity);
    }
    return treatEntities;
  }

  async create(props: TreatProps) {
    const treat: any = props;
    if (props.id) {
      treat._id = props.id;
    }
    const treatModel = new this.options.db.Treat(treat);

    const treatEntity = await treatModelToEntity(treatModel);

    treatModel.save();

    return treatEntity;
  }
}

async function treatModelToEntity(model: TreatModel): Promise<Treat> {
  return {
    id: model._id,
    idTreatSource: model.idTreatSource,
    name: model.name,
    config: model.config,
  };
}
