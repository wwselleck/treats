import express = require("express");
import * as E from "fp-ts/lib/Either";
import { TreatSourceService } from "../packages/core";

export function createTreatSourceRouter(
  treatSourceService: TreatSourceService
) {
  const TreatSourceRouter = express
    .Router()
    .get("/", async (_, res: express.Response) => {
      const sources = await treatSourceService.all();
      if (E.isLeft(sources)) {
        throw sources.left;
      }
      res.json(sources.right);
    })
    .get(
      "/:idTreatSource",
      async (req: express.Request, res: express.Response) => {
        const idTreatSource = req.param("idTreatSource");
        const treatSource = await treatSourceService.get(idTreatSource);
        if (!treatSource) {
          res.status(404);
          res.send();
        }
        res.json(treatSource);
      }
    );

  return TreatSourceRouter;
}
