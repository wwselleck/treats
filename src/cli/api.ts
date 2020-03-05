import axios, { AxiosInstance } from "axios";
import { Config } from "../config";

export class TreatsAPI {
  origin: string = `http://localhost:${Config.SERVER_PORT}`;

  axiosClient: AxiosInstance;

  constructor() {
    this.axiosClient = axios.create({
      baseURL: this.origin,
      responseType: "json"
    });
  }

  async getTreats() {
    const path = `/treat`;
    const response = await this.axiosClient.get(path);
    return response.data;
  }

  async getItems(idTreat: string) {
    const path = `/treat/${idTreat}/items`;
    const response = await this.axiosClient.get(path);
    return response.data;
  }
}
