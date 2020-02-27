import express = require("express");
import { TreatSourceRepo, TreatRepo, ItemLoader } from "../core";

interface TreatRouterConfig {
  treatSourceRepo: TreatSourceRepo;
  treatRepo: TreatRepo;
  itemLoader: ItemLoader;
}

export function createTreatRouter({
  treatSourceRepo,
  treatRepo,
  itemLoader
}: TreatRouterConfig) {
  const TreatSourceRouter = express
    .Router()
    .get("/", async (_, res: express.Response) => {
      const treats = await treatRepo.all();
      res.json(treats);
    })
    .post("/", async (req: express.Request, res: express.Response) => {
      const { idTreatSource, name, config } = req.body;
      const treatSource = await treatSourceRepo.get(idTreatSource);
      if (!treatSource) {
        res.status(404);
        res.send();
        return;
      }
      const treat = await treatRepo.create({
        idTreatSource,
        name,
        config: config
      });
      res.json(treat);
    })
    .get("/all", async (req: express.Request, res: express.Response) => {})
    .get("/:idTreat", async (req: express.Request, res: express.Response) => {
      const { idTreat } = req.params;
      const treat = await treatRepo.get(idTreat);
      if (!treat) {
        res.status(404);
        res.send();
        return;
      }
      res.json(treat);
    })
    .get(
      "/:idTreat/items",
      async (req: express.Request, res: express.Response) => {
        const { idTreat } = req.params;
        const treat = await treatRepo.get(idTreat);
        if (!treat) {
          res.status(404);
          res.send();
          return;
        }

        const items = await itemLoader.load(treat);
        res.json(items);
      }
    );

  return TreatSourceRouter;
}
