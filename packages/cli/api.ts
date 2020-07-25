import axios, { AxiosInstance } from "axios";
import {
  SerializedTreatItem,
  SerializedTreat,
  SerializedTreatInput,
  SerializedTreatSource,
} from "../serialize";

export class TreatsAPI {
  origin: string = `http://localhost:3218`;

  axiosClient: AxiosInstance;

  constructor() {
    this.axiosClient = axios.create({
      baseURL: this.origin,
      responseType: "json",
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

  async getItems(idTreat: string = "all"): Promise<Array<SerializedTreatItem>> {
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
