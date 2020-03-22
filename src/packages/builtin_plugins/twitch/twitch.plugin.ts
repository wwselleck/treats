import { Item, TreatSourceConfigOptionType } from "../../core";
import { PluginDefinition } from "../../plugin";
import { TwitchAPI, Stream } from "./twitch_api";
import { ScoringPipeline, ArrayPositionPipe } from "../../item_scoring";

interface TwitchPluginConfig {
  clientId: string;
  token: string;
}

const TwitchPlugin: PluginDefinition = {
  name: "builtin/twitch",
  treatSources: {
    Twitch: {
      name: "Twitch",
      configOptions: {
        test: {
          optionName: "Test",
          optionType: TreatSourceConfigOptionType.String
        }
      },
      async loadItems(config, pluginConfig: TwitchPluginConfig) {
        const api = new TwitchAPI(pluginConfig);
        const liveStreams = await api.getLiveFollows();
        const items = liveStreams.map(mapStreamToItem);
        return new ScoringPipeline<Item>([ArrayPositionPipe]).score(items);
      }
    }
  }
};

function mapStreamToItem(stream: Stream): Item {
  return {
    id: stream.id,
    title: `${stream.user_name}: ${stream.title}`,
    link: `https://twitch.tv/${stream.user_name}`,
    date: new Date(),
    score: 0
  };
}

module.exports = TwitchPlugin;
