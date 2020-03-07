import axios, { AxiosInstance } from "axios";
import {
  SerializedTreatItem,
  SerializedTreat,
  SerializedTreatInput,
  SerializedTreatSource
} from "../server";
import { Config } from "../packages/config";

export class TreatsAPI {
  origin: string = `http://localhost:${Config.SERVER_PORT}`;

  axiosClient: AxiosInstance;

  constructor() {
    this.axiosClient = axios.create({
      baseURL: this.origin,
      responseType: "json"
    });
  }

  async getTreats(): Promise<Array<SerializedTreat>> {
    const path = `/treat`;
    const response = await this.axiosClient.get(path);
    return response.data;
  }

  async createTreat(treat: SerializedTreatInput): Promise<SerializedTreat> {
    const path = `/treat`;
    const response = await this.axiosClient.post(path, treat);
    return response.data;
  }

  async getItems(idTreat: string): Promise<Array<SerializedTreatItem>> {
    const path = `/treat/${idTreat}/items`;
    const response = await this.axiosClient.get(path);
    return response.data;
  }

  async getTreatSources(): Promise<Array<SerializedTreatSource>> {
    const path = `/treatsource`;
    const response = await this.axiosClient.get(path);
    return response.data;
  }
}
