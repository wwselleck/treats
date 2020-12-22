import snoowrap = require("snoowrap");

import { Plugin } from "@treats-app/plugin";
import { Item, TreatSourceOptionType } from "@treats-app/core";
import { ScoringPipeline, ArrayPositionPipe } from "../item_scoring";

interface RedditPluginSetup {
  clientId: string;
  clientSecret: string;
  refreshToken: string;
}

const RedditPlugin: Plugin = {
  name: "builtin/reddit",
  treatSources: {
    Reddit: {
      name: "Reddit",
      setup: {
        clientId: {
          optionName: "clientId",
          optionType: TreatSourceOptionType.String,
          isRequired: true,
        },
        clientSecret: {
          optionName: "clientSecret",
          optionType: TreatSourceOptionType.String,
          isRequired: true,
        },
        refreshToken: {
          optionName: "refreshToken",
          optionType: TreatSourceOptionType.String,
          isRequired: true,
        },
      },
      config: {
        test: {
          optionName: "Test",
          optionType: TreatSourceOptionType.String,
        },
      },
      async loadItems(setup: RedditPluginSetup) {
        const client = new RedditAPI(setup);
        const submissions = await client.getSubmissions();

        const items = submissions.map(mapSubmissionToItem);
        const scoredItems = new ScoringPipeline<Item>([
          ArrayPositionPipe,
        ]).score(items);
        return scoredItems;
      },
    },
  },
};

function mapSubmissionToItem(s: snoowrap.Submission) {
  return {
    id: s.id,
    idTreatSource: "idk",
    date: new Date(s.created_utc * 1000),
    title: s.title,
    description: s.selftext,
    link: `https://reddit.com${s.permalink}`,
    score: 500,
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
  constructor(config: RedditAPIConfig) {
    this.client = new snoowrap({
      ...config,
      userAgent: "treats_builtin/reddit",
    });
  }

  async getSubmissions() {
    return this.client.getHot();
  }
}

module.exports = RedditPlugin;
