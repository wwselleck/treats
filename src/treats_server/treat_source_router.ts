import express = require("express");
import { ExampleTreatSource } from "../treat_source";

const AvailableTreatSources = {
  [ExampleTreatSource.id]: ExampleTreatSource
};

export const TreatSourceRouter = express
  .Router()
  .get("/", (_, res: express.Response) => {
    res.json(Object.values(AvailableTreatSources));
  })
  .get("/:idTreatSource", (req: express.Request, res: express.Response) => {
    const idTreatSource = req.param("idTreatSource");
    const treatSource = AvailableTreatSources[idTreatSource];
    if (!treatSource) {
      res.status(404);
      res.send();
    }
    res.json(treatSource);
  });

