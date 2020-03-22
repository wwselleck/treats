import express = require("express");
import { isOk, isError } from "../packages/types/result";
import {
  TreatSourceService,
  TreatService,
  NotFoundError
} from "../packages/core";
import { TreatItemLoader } from "../packages/item_loader";
import { serializeTreat, serializeTreatItem } from "./serialize";
import { ExpressResponseHelper } from "./express_helper";
import { indexArray } from "../packages/util";

interface TreatRouterConfig {
  treatSourceService: TreatSourceService;
  treatService: TreatService;
  treatItemLoader: TreatItemLoader;
}

export function createTreatRouter({
  treatSourceService,
  treatService,
  treatItemLoader
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
    .get("/all/items", async (req: express.Request, res: express.Response) => {
      const treats = await treatService.all();
      if (isError(treats)) {
        ExpressResponseHelper.InternalServerError(res);
        return;
      }

      const items = await treatItemLoader.loadAll(treats.value);

      if (isError(items)) {
        ExpressResponseHelper.InternalServerError(res);
        return;
      }

      const indexedTreats = indexArray(treats.value, "id");
      res.json(
        items.value.map(i => serializeTreatItem(i, indexedTreats[i.idTreat]))
      );
    })
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
        const items = await treatItemLoader.load(treat.value);

        if (isError(items)) {
          ExpressResponseHelper.InternalServerError(res);
          return;
        }
        res.json(items.value.map(i => serializeTreatItem(i, treat.value)));
      }
    );

  return TreatSourceRouter;
}
