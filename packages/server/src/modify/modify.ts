import { Item, Modifier } from "@treats-app/core";
import { match } from "./matcher";
import { applyModification } from "./apply_modification";

export const applyModifier = (modifier: Modifier) => <T extends Item>(
  item: T
): T => {
  const matches = match(item, modifier.match);

  if (!matches) {
    return item;
  }

  const itemWithModification = applyModification(item, modifier.modification);

  return itemWithModification;
};

export const applyModifiers = <T extends Item>(modifiers?: Array<Modifier>) => (
  item: T
): T => {
  if (!modifiers) {
    return item;
  }
  let res = item;
  for (const m of modifiers) {
    const modified = applyModifier(m)(res);
    res = modified;
  }
  return res;
};
