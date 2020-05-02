import {
  Item,
  TreatSourceConfigOptionType,
  TreatSourceItemInfoType
} from "../../core";
import { PluginDefinition } from "../../plugin";
import { TwitchAPI, Stream } from "./twitch_api";
import { ScoringPipeline, ArrayPositionPipe } from "../../item_scoring";

interface TwitchPluginConfig {
  clientId: string;
  token: string;
}

interface ItemInfo {
  streamerName: string;
}

const TwitchPlugin: PluginDefinition = {
  name: "builtin/twitch",
  treatSources: {
    Twitch: {
      name: "Twitch",
      configOptions: {},
      itemInfo: {
        streamerName: TreatSourceItemInfoType.String
      },
      async loadItems(config, pluginConfig: TwitchPluginConfig) {
        const api = new TwitchAPI(pluginConfig);
        const liveStreams = await api.getLiveFollows();
        const items = liveStreams.map(mapStreamToItem);
        return new ScoringPipeline<Item<ItemInfo>>([ArrayPositionPipe]).score(
          items
        );
      }
    }
  }
};

function mapStreamToItem(stream: Stream): Item<ItemInfo> {
  return {
    id: stream.id,
    title: `${stream.user_name}: ${stream.title}`,
    link: `https://twitch.tv/${stream.user_name}`,
    date: new Date(),
    score: 0,
    info: {
      streamerName: stream.user_name
    }
  };
}

module.exports = TwitchPlugin;
