import express = require("express");

export class ExpressResponseHelper {
  static InternalServerError(res: express.Response) {
    res.status(500);
    res.send();
  }
}

