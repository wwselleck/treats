import {
  Plugin,
  PluginTreatSource,
  InitializedPlugin,
  InitializedPluginTreatSource
} from "../plugin";

import { TreatSourceConfigOptionType } from "../core";

interface RedditPluginConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

class RedditTreatSource implements InitializedPluginTreatSource {
  name = "reddit";
  configOptions = {
    test: {
      optionName: "Test",
      optionType: TreatSourceConfigOptionType.String
    }
  };

  constructor(private config: RedditPluginConfig) {}

  loadItems() {
    console.log(this.config);
    return Promise.resolve([]);
  }
}

const RedditPlugin: Plugin = {
  pluginName: "builtin/reddit",
  init(config: RedditPluginConfig) {
    console.log(config);
    return {
      pluginName: RedditPlugin.pluginName,
      treatSource: new RedditTreatSource(config)
    };
  }
};
