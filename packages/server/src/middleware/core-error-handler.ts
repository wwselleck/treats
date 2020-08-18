import express = require("express");
import { NotFoundError } from "@treats-app/core";

const handleCoreError = (req: express.Request, res: express.Response) => (
  e: Error
) => {
  if (e instanceof NotFoundError) {
    res.status(404);
    res.send(e.message);
  } else {
    return false;
  }
  return true;
};

export function coreErrorHandler() {
  return (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    try {
      next();
    } catch (e) {
      console.log("here");
      handleCoreError(req, res);
      next();
    }
  };
}
