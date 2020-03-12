import { Result, ok, error, isError } from "../../types/result";
import {
  Treat,
  TreatService,
  TreatProps,
  TreatSourceService,
  NotFoundError
} from "../../core";
import { logger } from "../../logger";
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
      if (isError(treatEntity)) {
        logger.warn("Skipping look here");
      } else {
        treatEntities.push(treatEntity.value);
      }
    }
    return ok(treatEntities);
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

    if (isError(treatEntity)) {
      return treatEntity;
    }
    treatModel.save();
    return treatEntity;
  }
}

async function treatModelToEntity(
  model: TreatModel,
  treatSourceService: TreatSourceService
): Promise<Result<Treat>> {
  const treatSource = await treatSourceService.get(model.idTreatSource);
  if (isError(treatSource)) {
    return error(new Error("Invalid treatSource"));
  }

  return ok({
    id: model._id,
    idTreatSource: model.idTreatSource,
    name: model.name,
    config: model.config,
    treatSource: treatSource.value
  });
}