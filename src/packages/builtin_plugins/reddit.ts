import snoowrap = require("snoowrap");

import { PluginDefinition } from "../plugin";
import { TreatSourceItem, TreatSourceConfigOptionType } from "../core";

interface RedditPluginConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

const RedditPlugin: PluginDefinition = {
  name: "builtin/reddit",
  treatSources: {
    Reddit: {
      name: "Reddit",
      configOptions: {
        test: {
          optionName: "Test",
          optionType: TreatSourceConfigOptionType.String
        }
      },
      async loadItems(config, pluginConfig: RedditPluginConfig) {
        console.log();
        const client = new RedditAPI(pluginConfig);
        const submissions = await client.getSubmissions();

        console.log("here!");
        console.log(submissions);
        return submissions.map(mapSubmissionToTreatSourceItem);
      }
    }
  }
};

function mapSubmissionToTreatSourceItem(
  s: snoowrap.Submission
): TreatSourceItem {
  return {
    id: s.id,
    idTreatSource: "idk",
    title: s.title,
    link: s.permalink,
    score: 1000
  };
}

interface RedditAPIConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

class RedditAPI {
  client: snoowrap;
  constructor(private config: RedditAPIConfig) {
    console.log("confnig");
    console.log(config);
    this.client = new snoowrap({
      ...config,
      userAgent: "treats-dev-scratchpad"
    });
  }

  async getSubmissions() {
    return this.client.getHot();
  }
}

module.exports = RedditPlugin;
