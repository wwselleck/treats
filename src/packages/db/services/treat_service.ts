import { ok, error } from "../../types/result";
import {
  Treat,
  TreatService,
  TreatProps,
  TreatSourceService,
  NotFoundError
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
      _id: id
    });

    if (!treat) {
      return error(new NotFoundError());
    }

    return ok(await treatModelToEntity(treat, this.options.treatSourceService));
  }

  async all() {
    const treats = await this.options.db.Treat.find();
    return ok(
      await Promise.all(
        treats.map(treat =>
          treatModelToEntity(treat, this.options.treatSourceService)
        )
      )
    );
  }

  async create(props: TreatProps) {
    const treat: any = props;
    if (props.id) {
      treat._id = props.id;
    }
    const treatModel = new this.options.db.Treat(treat);
    treatModel.save();
    return ok(
      await treatModelToEntity(treatModel, this.options.treatSourceService)
    );
  }
}

async function treatModelToEntity(
  model: TreatModel,
  treatSourceService: TreatSourceService
): Promise<Treat> {
  const treatSource = await treatSourceService.get(model.idTreatSource);
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
