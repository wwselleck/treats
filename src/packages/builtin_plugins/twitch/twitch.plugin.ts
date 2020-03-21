import { TreatSourceItem, TreatSourceConfigOptionType } from "../../core";
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
        const items = liveStreams.map(mapStreamToTreatSourceItem);
        return new ScoringPipeline<TreatSourceItem>([ArrayPositionPipe]).score(
          items
        );
      }
    }
  }
};

function mapStreamToTreatSourceItem(stream: Stream): TreatSourceItem {
  return {
    id: stream.id,
    idTreatSource: "idk2",
    title: stream.title,
    date: new Date(),
    score: 0
  };
}

module.exports = TwitchPlugin;
