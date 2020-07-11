import express = require("express");
import * as E from "fp-ts/lib/Either";

import { TreatSourceService, TreatService, NotFoundError } from "./core";
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
      console.log("here");
      const treats = await treatService.all();
      if (E.isRight(treats)) {
        res.json(treats.right.map(serializeTreat));
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
        config: config,
      });
      if (E.isRight(treat)) {
        res.json(serializeTreat(treat.right));
      } else {
        ExpressResponseHelper.InternalServerError(res);
        return;
      }
    })
    .get("/all/items", async (req: express.Request, res: express.Response) => {
      const treats = await treatService.all();

      if (E.isLeft(treats)) {
        ExpressResponseHelper.InternalServerError(res);
        return;
      }

      const items = await treatItemLoader.loadAll(treats.right);

      if (E.isLeft(items)) {
        ExpressResponseHelper.InternalServerError(res);
        return;
      }

      const indexedTreats = indexArray(treats.right, "id");
      res.json(
        items.right.map((i) => serializeTreatItem(i, indexedTreats[i.idTreat]))
      );
    })
    .get("/:idTreat", async (req: express.Request, res: express.Response) => {
      const { idTreat } = req.params;
      const treat = await treatService.get(idTreat);
      if (E.isLeft(treat)) {
        if (treat.left instanceof NotFoundError) {
          res.status(404);
          res.send();
          return;
        }
        ExpressResponseHelper.InternalServerError(res);
        return;
      }
      res.json(treat.right);
    })
    .get(
      "/:idTreat/items",
      async (req: express.Request, res: express.Response) => {
        const { idTreat } = req.params;
        const treat = await treatService.get(idTreat);
        if (E.isLeft(treat)) {
          ExpressResponseHelper.InternalServerError(res);
          return;
        }
        const items = await treatItemLoader.load(treat.right);

        if (E.isLeft(items)) {
          ExpressResponseHelper.InternalServerError(res);
          return;
        }
        res.json(items.right.map((i) => serializeTreatItem(i, treat.right)));
      }
    );

  return TreatSourceRouter;
}
