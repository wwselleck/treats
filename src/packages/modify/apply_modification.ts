import { ok, error } from "../types/result";
import { Item, Modification } from "../core";

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
  modification: Modification
): ModificationApplier<T> | null {
  const { kind } = modification;
  if (kind === "pin") {
    return ModificationAppliers.pin;
  } else {
    return null;
  }
}

export function applyModification<T extends Item>(
  item: T,
  modification: Modification
) {
  const modificationApplier = getModificationApplier<T>(modification);
  if (!modificationApplier) {
    return error(
      new Error(
        `Could not apply modifier for invalid modification ${modification.kind}`
      )
    );
  }

  return ok(modificationApplier(item));
}
