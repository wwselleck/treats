import express = require("express");
import { TreatSourceService } from "../packages/core";
import { isError } from "../packages/types/result";

export function createTreatSourceRouter(
  treatSourceService: TreatSourceService
) {
  const TreatSourceRouter = express
    .Router()
    .get("/", async (_, res: express.Response) => {
      const sources = await treatSourceService.all();
      if (isError(sources)) {
        throw sources.error;
      }
      res.json(sources.value);
      console.log("hi");
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
