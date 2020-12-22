import { Item, TreatSourceOptionType } from "@treats-app/core";
import { Plugin } from "@treats-app/plugin";
import * as TwitchAPI from "./twitch_api";
import { ScoringPipeline, ArrayPositionPipe } from "../../item_scoring";

interface TwitchPluginSetup {
  clientId: string;
  token: string;
  username: string;
}

interface ItemInfo {
  streamerName: string;
}

const TwitchPlugin: Plugin = {
  name: "builtin/twitch",
  treatSources: {
    Twitch: {
      name: "Twitch",
      setup: {
        clientId: {
          optionName: "clientId",
          optionType: TreatSourceOptionType.String,
          isRequired: true,
        },
        token: {
          optionName: "token",
          optionType: TreatSourceOptionType.String,
          isRequired: true,
        },
        username: {
          optionName: "username",
          optionType: TreatSourceOptionType.String,
          isRequired: true,
        },
      },
      async loadItems(setup: TwitchPluginSetup) {
        const api = new TwitchAPI.TwitchAPI(setup);
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
