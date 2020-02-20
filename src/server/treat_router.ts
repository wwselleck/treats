import express = require("express");
import { TreatSourceRepo } from "./repos";
import { TreatRepo } from "./repos";
import { loadItems } from "./services/treat_source";

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
      console.log(treats);
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
        // get treat

        const { idTreat } = req.params;
        const treat = await treatRepo.get(idTreat);
        if (!treat) {
          res.status(404);
          res.send();
          return;
        }

        const { idTreatSource } = treat;
        const treatSource = await treatSourceRepo.get(idTreatSource);
        if (!treatSource) {
          res.status(404);
          res.send();
          return;
        }

        const items = await loadItems(treatSource);
        res.json(items);
      }
    );

  return TreatSourceRouter;
}
