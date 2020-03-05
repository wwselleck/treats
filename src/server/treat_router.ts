import express = require("express");
import { TreatSourceRepo, TreatRepo } from "../core";
import { TreatItemLoader } from "../services";
import { serializeTreat } from "./serialize";

interface TreatRouterConfig {
  treatSourceRepo: TreatSourceRepo;
  treatRepo: TreatRepo;
}

export function createTreatRouter({
  treatSourceRepo,
  treatRepo
}: TreatRouterConfig) {
  const TreatSourceRouter = express
    .Router()
    .get("/", async (_, res: express.Response) => {
      const treats = await treatRepo.all();
      res.json(treats.map(serializeTreat));
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
      res.json(serializeTreat(treat));
    })
    .get(
      "/all/items",
      async (req: express.Request, res: express.Response) => {}
    )
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

        const items = await TreatItemLoader.load(treat);
        res.json(items);
      }
    );

  return TreatSourceRouter;
}
