import { ok, Result, pipe, isError } from "../types/result";
import { Item, Modifier } from "../core";
import { match } from "./matcher";
import { applyModification } from "./apply_modification";

export const applyModifier = (modifier: Modifier) => <T extends Item>(
  item: T
): Result<T> => {
  const matches = match(item, modifier.match);
  if (isError(matches)) {
    return matches;
  }

  if (!matches.value) {
    return ok(item);
  }

  const itemWithModification = applyModification(item, modifier.modification);

  return itemWithModification;
};

export const applyModifiers = <T extends Item>(modifiers?: Array<Modifier>) => (
  item: T
): Result<T> => {
  if (!modifiers) {
    return ok(item);
  }
  return pipe<T>(modifiers.map((m) => applyModifier(m)))(item);
};
