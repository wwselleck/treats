import * as E from "fp-ts/lib/Either";
import { Item, Modifier } from "../core";
import { match } from "./matcher";
import { applyModification } from "./apply_modification";

export const applyModifier = (modifier: Modifier) => <T extends Item>(
  item: T
): E.Either<Error, T> => {
  const matches = match(item, modifier.match);
  if (E.isLeft(matches)) {
    return matches;
  }

  if (!matches.right) {
    return E.right(item);
  }

  const itemWithModification = applyModification(item, modifier.modification);

  return itemWithModification;
};

export const applyModifiers = <T extends Item>(modifiers?: Array<Modifier>) => (
  item: T
): E.Either<Error, T> => {
  if (!modifiers) {
    return E.right(item);
  }
  let res = item;
  for (const m of modifiers) {
    const modified = applyModifier(m)(res);
    if (E.isLeft(modified)) {
      return modified;
    }
    res = modified.right;
  }
  return E.right(res);
};
