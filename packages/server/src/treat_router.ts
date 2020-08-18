import express = require("express");

import {
  Treat,
  TreatSourceService,
  TreatService,
  NotFoundError,
} from "@treats-app/core";
import { TreatItemLoader } from "./item_loader";
import { serializeTreat, serializeTreatItem } from "./serialize";
import { ExpressResponseHelper } from "./express_helper";
import { indexArray } from "./util";

interface TreatRouterConfig {
  treatSourceService: TreatSourceService;
  treatService: TreatService;
  treatItemLoader: TreatItemLoader;
}

export function createTreatRouter({
  treatSourceService,
  treatService,
  treatItemLoader,
}: TreatRouterConfig) {
  const TreatSourceRouter = express
    .Router()
    .get("/", async (_, res: express.Response) => {
      const treats = await treatService.all();
      res.json(treats.map(serializeTreat));
      return;
    })
    .post("/", async (req: express.Request, res: express.Response) => {
      const { idTreatSource, name, config } = req.body;
      const treatSource = await treatSourceService.get(idTreatSource);
      if (!treatSource) {
        res.status(404);
        res.send(`TreatSource with id ${idTreatSource} was not found`);
        return;
      }
      const treat = await treatService.create({
        idTreatSource,
        name,
        config: config,
      });
      if (treat) {
        res.json(serializeTreat(treat));
      } else {
        ExpressResponseHelper.InternalServerError(res);
        return;
      }
    })
    .get("/all/items", async (req: express.Request, res: express.Response) => {
      const treats = await treatService.all();

      const items = await treatItemLoader.loadAll(treats);

      const indexedTreats = indexArray<Treat, "id">(treats, "id");
      res.json(
        items.map((i) => serializeTreatItem(i, indexedTreats[i.idTreat]))
      );
    })
    .get("/:idTreat", async (req: express.Request, res: express.Response) => {
      const { idTreat } = req.params;
      try {
        const treat = await treatService.get(idTreat);
        res.json(treat);
      } catch (e) {
        if (e instanceof NotFoundError) {
          res.status(404);
          res.send();
          return;
        }
        ExpressResponseHelper.InternalServerError(res);
        return;
      }
    })
    .get(
      "/:idTreat/items",
      async (req: express.Request, res: express.Response) => {
        const { idTreat } = req.params;
        const treat = await treatService.get(idTreat);
        const items = await treatItemLoader.load(treat);

        res.json(items.map((i) => serializeTreatItem(i, treat)));
      }
    );

  return TreatSourceRouter;
}
