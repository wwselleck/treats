import mongoose = require("mongoose");

export interface TreatModel extends mongoose.Document {
  idTreatSource: string;
  name: string;
  config: Map<string, any>;
}

const TreatSchema = new mongoose.Schema<TreatModel>({
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