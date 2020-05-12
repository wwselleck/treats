import { ok, error, Result, pipe } from "../types/result";
import { Item, Modifier, ItemMatch, KeywordsItemMatch } from "../core";

type Matcher = (item: Item) => boolean;

const Matchers = {
  keywords: ({ keywords }: KeywordsItemMatch) => (item: Item): boolean => {
    return keywords.some((keyword) => item.title.includes(keyword));
  },
};

// Maybe look into a better way to do this at some point
// https://stackoverflow.com/questions/56781010/typescript-how-to-map-objects-in-a-discriminated-union-to-functions-they-can-be
export function getMatcher(itemMatch: ItemMatch): Matcher | null {
  const { kind } = itemMatch;
  if (kind === "keywords") {
    return Matchers.keywords(itemMatch);
  } else {
    return null;
  }
}

export function match(item: Item, itemMatch: ItemMatch): Result<boolean> {
  const matcher = getMatcher(itemMatch);
  if (!matcher) {
    return error(
      new Error(
        `Could not apply modifier for invalid matcher ${itemMatch.kind}`
      )
    );
  }
  return ok(matcher(item));
}

