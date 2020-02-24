import axios, { AxiosInstance } from "axios";
import { Config } from "../config";

export class TreatsAPI {
  origin: string = `http://localhost:${Config.SERVER_PORT}`;

  axiosClient: AxiosInstance;

  constructor() {
    console.log(this.origin);
    this.axiosClient = axios.create({
      baseURL: this.origin,
      responseType: "json"
    });
  }

  async getTreats() {
    const path = `/treat`;
    const response = await this.axiosClient.get("/treat");
    console.log("toots");
    console.log(response.data);
  }

  async getItems(idTreat: string) {
    console.log(this.origin);
    const path = `/treat/${idTreat}/items`;
    const response = await this.axiosClient.get(path);
    console.log(response.data);
  }
}
