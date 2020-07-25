import { Item, ItemMatch, KeywordsItemMatch } from "@treats-app/core";

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

export function match(item: Item, itemMatch: ItemMatch): boolean {
  const matcher = getMatcher(itemMatch);
  if (!matcher) {
    throw new Error(`invalid matcher ${itemMatch.kind}`);
  }
  return matcher(item);
}
