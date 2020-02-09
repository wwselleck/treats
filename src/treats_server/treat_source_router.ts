import express = require("express");
import { TreatSourceRepo } from "../repos";

export function createTreatSourceRouter(treatSourceRepo: TreatSourceRepo) {
  const TreatSourceRouter = express
    .Router()
    .get("/", async (_, res: express.Response) => {
      const sources = Array.from(await treatSourceRepo.all());
      res.json(sources);
    })
    .get(
      "/:idTreatSource",
      async (req: express.Request, res: express.Response) => {
        const idTreatSource = req.param("idTreatSource");
        const treatSource = await treatSourceRepo.get(idTreatSource);
        console.log(treatSource);
        if (!treatSource) {
          res.status(404);
          res.send();
        }
        res.json(treatSource);
      }
    );

  return TreatSourceRouter;
}
