import snoowrap = require("snoowrap");
import { pipe } from "fp-ts/lib/pipeable";

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
        const client = new RedditAPI(pluginConfig);
        const submissions = await client.getSubmissions();

        const items = submissions.map(mapSubmissionToTreatSourceItem);
        const scoredItems = scoreItems(items);
        return scoredItems;
      }
    }
  }
};

function scoreItems(items: Array<TreatSourceItem>) {
  return pipe(items, applyArrayPositionMultiplier);
}

function applyArrayPositionMultiplier(items: Array<TreatSourceItem>) {
  console.log(items);
  const totalItems = items.length;

  return items.map((item, i) => {
    const baseMultiplier = 1;
    const multiplierFloor = 0.8;
    const multiplierDistance = baseMultiplier - multiplierFloor;

    const multiplier = baseMultiplier - multiplierDistance * (i / totalItems);
    console.log(multiplier);
    return {
      ...item,
      score: item.score * multiplier
    };
  });
}

function mapSubmissionToTreatSourceItem(s: snoowrap.Submission) {
  return {
    id: s.id,
    idTreatSource: "idk",
    date: new Date(s.created_utc * 1000),
    title: s.title,
    description: s.selftext,
    link: `https://reddit.com${s.permalink}`,
    score: 500
  };
}

/* Not going to use for now since Reddit hot listing
 * already accounts for date created n stuff
function dateMultiplierForRedditSubmission(s: snoowrap.Submission) {
  const dateCreated = new Date(s.created_utc * 1000);
  const now = new Date();
  const twoDaysAgo = dateDaysAgo(2);

  const percentage =
    Math.abs(dateCreated - twoDaysAgo) / Math.abs(now - twoDaysAgo);
  console.log(`${percentage}%`);
  return 1 - 0.1 * percentage;
}

function dateDaysAgo(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return date;
}
*/

interface RedditAPIConfig {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

class RedditAPI {
  client: snoowrap;
  constructor(private config: RedditAPIConfig) {
    this.client = new snoowrap({
      ...config,
      userAgent: "treats_builtin/reddit"
    });
  }

  async getSubmissions() {
    return this.client.getHot();
  }
}

module.exports = RedditPlugin;
