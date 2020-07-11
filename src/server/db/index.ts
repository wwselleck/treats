export * from "./services/treat_service";

import mongoose = require("mongoose");

export interface TreatModel extends mongoose.Document {
  idTreatSource: string;
  name: string;
  config: Map<string, any>;
}

const TreatSchema = new mongoose.Schema<TreatModel>({
  _id: String,
  idTreatSource: String,
  name: String,
  config: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
});

export interface DB {
  Treat: mongoose.Model<TreatModel>;
}

export const connectToDB = (uri: string): DB => {
  let connection = mongoose.createConnection(uri, { useNewUrlParser: true });
  return {
    Treat: connection.model<TreatModel>("Treat", TreatSchema)
  };
};

//HEY!
// Question: seeding treats is confusing
// i think the way to go is to not seed Mongo, and instead just create a
// UserDataTreatService or something like that, and keep local Treats out of the DB
