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

interface TwitchAPIOptions {
  clientId: string;
  token: string;
}
export class TwitchAPI {
  axiosClient: AxiosInstance;
  constructor(options: TwitchAPIOptions) {
    this.axiosClient = axios.create({
      baseURL: "https://api.twitch.tv/helix",
      headers: {
        Authorization: `Bearer ${options.token}`,
        "Client-ID": options.clientId
      }
    });

    this.axiosClient.interceptors.response.use(
      res => res,
      error => {
        return Promise.reject(
          new Error(
            `Twitch API error: StatusCode=${error.response.status} Message=${error.response.data.message}`
          )
        );
      }
    );
  }

  async getLiveFollows(): Promise<Array<Stream>> {
    const user = await this.getAuthedUser();
    const follows = await this.getFollows(user);
    const streams = await this.getStreams(follows.map(f => f.to_id));
    const liveStreams = streams.filter(s => s.type === "live");
    return liveStreams;
  }

  async getAuthedUser() {
    return (await this.axiosClient.get("/users")).data.data[0];
  }

  async getFollows(user: User): Promise<Array<Follow>> {
    let follows: Array<any> = [];
    let hasMore = true;
    let cursor;
    while (hasMore) {
      const pageFollows: any = await this.axiosClient.get("/users/follows", {
        params: {
          from_id: user.id,
          first: 100,
          after: cursor || ""
        }
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
          first: 100
        }
      });
      streams = streams.concat(newStreams.data.data);
      i = i + batchSize;
    }
    return streams;
  }
}
