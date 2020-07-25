import { Item } from "@treats-app/core";
import { PluginDefinition } from "../../plugin";
import * as TwitchAPI from "./twitch_api";
import { ScoringPipeline, ArrayPositionPipe } from "../../item_scoring";

interface TwitchPluginConfig {
  clientId: string;
  token: string;
  username: string;
}

interface ItemInfo {
  streamerName: string;
}

const TwitchPlugin: PluginDefinition = {
  name: "builtin/twitch",
  treatSources: {
    Twitch: {
      name: "Twitch",
      async loadItems(config, pluginConfig: TwitchPluginConfig) {
        const api = new TwitchAPI.TwitchAPI(pluginConfig);
        const liveStreams = await api.getLiveFollows();
        const items = liveStreams.map(mapStreamToItem);
        return new ScoringPipeline<Item<ItemInfo>>([ArrayPositionPipe]).score(
          items
        );
      },
    },
  },
};

function mapStreamToItem(stream: TwitchAPI.Stream): Item<ItemInfo> {
  return {
    id: stream.id,
    title: `${stream.user_name}: ${stream.title}`,
    link: `https://twitch.tv/${stream.user_name}`,
    date: new Date(),
    score: 0,
  };
}

module.exports = TwitchPlugin;
