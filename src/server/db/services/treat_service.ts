import {
  Treat,
  TreatService,
  TreatProps,
  TreatSourceService,
  NotFoundError,
} from "../../core";
import { DB, TreatModel } from "..";

interface MongoTreatServiceOptions {
  db: DB;
  treatSourceService: TreatSourceService;
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

    const treatEntity = await treatModelToEntity(
      treat,
      this.options.treatSourceService
    );

    return treatEntity;
  }

  async all() {
    const treats = await this.options.db.Treat.find();

    const treatEntities = [];
    for (const treat of treats) {
      const treatEntity = await treatModelToEntity(
        treat,
        this.options.treatSourceService
      );
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

    const treatEntity = await treatModelToEntity(
      treatModel,
      this.options.treatSourceService
    );

    treatModel.save();

    return treatEntity;
  }
}

async function treatModelToEntity(
  model: TreatModel,
  treatSourceService: TreatSourceService
): Promise<Treat> {
  const treatSource = await treatSourceService.get(model.idTreatSource);

  return {
    id: model._id,
    name: model.name,
    config: model.config,
    treatSource: treatSource,
  };
}
