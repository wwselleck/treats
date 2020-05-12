import { ok, error, isOk, isError, Result, pipe } from "../types/result";
import { Item, Modifier, KeywordsItemMatch } from "../core";

type Matcher = (item: Item) => boolean;

const Matchers = {
  keywords: ({ keywords }: KeywordsItemMatch) => (item: Item): boolean => {
    return keywords.some((keyword) => item.title.includes(keyword));
  },
};

// Maybe look into a better way to do this at some point
// https://stackoverflow.com/questions/56781010/typescript-how-to-map-objects-in-a-discriminated-union-to-functions-they-can-be
export function getMatcher(modifier: Modifier): Matcher | null {
  const { kind } = modifier.match;
  if (kind === "keywords") {
    return Matchers.keywords(modifier.match);
  } else {
    return null;
  }
}

type ModificationApplier<T extends Item> = (item: T) => T;

const ModificationAppliers = {
  pin: <T extends Item>(item: T): T => {
    return {
      ...item,
      score: 1000,
    };
  },
};

export function getModificationApplier<T extends Item>(
  modifier: Modifier
): ModificationApplier<T> | null {
  const { kind } = modifier.modification;
  if (kind === "pin") {
    return ModificationAppliers.pin;
  } else {
    return null;
  }
}

export const applyModifier = (modifier: Modifier) => <T extends Item>(
  item: T
): Result<T> => {
  const matcher = getMatcher(modifier);
  if (!matcher) {
    return error(
      new Error(
        `Could not apply modifier for invalid matcher ${modifier.match.kind}`
      )
    );
  }

  const modificationApplier = getModificationApplier<T>(modifier);
  if (!modificationApplier) {
    return error(
      new Error(
        `Could not apply modifier for invalid modification ${modifier.modification.kind}`
      )
    );
  }

  if (matcher(item)) {
    return ok(modificationApplier(item));
  }

  return ok(item);
};

export const applyModifiers = <T extends Item>(modifiers?: Array<Modifier>) => (
  item: T
): Result<T> => {
  if (!modifiers) {
    return ok(item);
  }
  return pipe<T>(modifiers.map((m) => applyModifier(m)))(item);
};

