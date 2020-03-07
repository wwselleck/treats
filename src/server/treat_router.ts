import express = require("express");
import { isOk, isError } from "../packages/types/result";
import {
  TreatSourceService,
  TreatService,
  NotFoundError
} from "../packages/core";
import { TreatItemLoader } from "../packages/services";
import { serializeTreat } from "./serialize";
import { ExpressResponseHelper } from "./express_helper";

interface TreatRouterConfig {
  treatSourceService: TreatSourceService;
  treatService: TreatService;
}

export function createTreatRouter({
  treatSourceService,
  treatService
}: TreatRouterConfig) {
  const TreatSourceRouter = express
    .Router()
    .get("/", async (_, res: express.Response) => {
      const treats = await treatService.all();
      if (isOk(treats)) {
        res.json(treats.value.map(serializeTreat));
        return;
      }
    })
    .post("/", async (req: express.Request, res: express.Response) => {
      const { idTreatSource, name, config } = req.body;
      const treatSource = await treatSourceService.get(idTreatSource);
      if (!treatSource) {
        res.status(404);
        res.send();
        return;
      }
      const treat = await treatService.create({
        idTreatSource,
        name,
        config: config
      });
      if (isOk(treat)) {
        res.json(serializeTreat(treat.value));
      } else {
        ExpressResponseHelper.InternalServerError(res);
        return;
      }
    })
    .get(
      "/all/items",
      async (req: express.Request, res: express.Response) => {}
    )
    .get("/:idTreat", async (req: express.Request, res: express.Response) => {
      const { idTreat } = req.params;
      const treat = await treatService.get(idTreat);
      if (isError(treat)) {
        if (treat.error instanceof NotFoundError) {
          res.status(404);
          res.send();
          return;
        }
        ExpressResponseHelper.InternalServerError(res);
        return;
      }
      res.json(treat.value);
    })
    .get(
      "/:idTreat/items",
      async (req: express.Request, res: express.Response) => {
        const { idTreat } = req.params;
        const treat = await treatService.get(idTreat);
        if (isError(treat)) {
          ExpressResponseHelper.InternalServerError(res);
          return;
        }
        const items = await TreatItemLoader.load(treat.value);
        res.json(items);
      }
    );

  return TreatSourceRouter;
}
