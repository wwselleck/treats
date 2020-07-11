import axios, { AxiosInstance } from "axios";

interface User {
  id: string;
  login: string;
}

interface Follow {
  from_id: string;
  to_id: string;
}

export interface Stream {
  id: string;
  user_id: string;
  user_name: string;
  title: string;
  viewer_count: number;
  type: "live";
}

interface Config {
  clientId: string;
  token: string;
  username: string;
}

export class TwitchAPI {
  axiosClient: AxiosInstance;
  krakenClient: AxiosInstance;
  username: string;

  constructor({ clientId, token, username }: Config) {
    this.username = username;
    this.axiosClient = axios.create({
      baseURL: "https://api.twitch.tv/helix",
      headers: {
        Authorization: `Bearer ${token}`,
        "Client-ID": clientId,
      },
    });

    // The /users endpoint for helix doesn't allow use from
    // app access tokens, so relying on kraken for now
    this.krakenClient = axios.create({
      baseURL: "https://api.twitch.tv/kraken",
      headers: {
        "Client-ID": clientId,
        Accept: "application/vnd.twitchtv.v5+json",
      },
    });

    this.axiosClient.interceptors.response.use(
      (res) => res,
      (error) => {
        console.log(error);
        return Promise.reject(
          new Error(
            `Twitch API error: StatusCode=${error.response.status} Message=${error.response.data.message}`
          )
        );
      }
    );
  }

  async getLiveFollows(): Promise<Array<Stream>> {
    const userID = await this.getUserID();
    const follows = await this.getFollows(userID);
    const streams = await this.getStreams(follows.map((f) => f.to_id));
    const liveStreams = streams.filter((s) => s.type === "live");
    return liveStreams;
  }

  async getUserID() {
    return (
      await this.krakenClient.get("/users", {
        params: {
          login: this.username,
        },
      })
    ).data?.users[0]?._id;
  }

  async getFollows(userID: string): Promise<Array<Follow>> {
    let follows: Array<any> = [];
    let hasMore = true;
    let cursor;
    while (hasMore) {
      const pageFollows: any = await this.axiosClient.get("/users/follows", {
        params: {
          from_id: userID,
          first: 100,
          after: cursor || "",
        },
      });
      follows = follows.concat(pageFollows.data.data);
      if (pageFollows.data.pagination.cursor) {
        cursor = pageFollows.data.pagination.cursor;
      } else {
        hasMore = false;
      }
    }
    return follows;
  }

  async getStreams(userIds: Array<string>): Promise<Array<Stream>> {
    let batchSize = 100;
    let streams: Array<any> = [];
    let i = 0;
    while (i < userIds.length) {
      const batchUserIds = userIds.slice(i, batchSize + i);
      const newStreams = await this.axiosClient.get("/streams", {
        params: {
          user_id: batchUserIds,
          first: 100,
        },
      });
      streams = streams.concat(newStreams.data.data);
      i = i + batchSize;
    }
    return streams;
  }
}

