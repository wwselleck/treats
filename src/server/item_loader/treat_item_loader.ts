import { isLeft, isRight, Either, left, right, Right } from "fp-ts/lib/Either";

import { Treat, TreatItem, TreatSourceItem } from "../core";
import { PluginService } from "../plugin";
import { TreatSourceItemLoader } from "./treat_source_item_loader";
import { applyModifiers } from "../modify";

function sort(items: Array<TreatItem>) {
  return items.sort((i1, i2) => i2.score - i1.score);
}

export class TreatItemLoader {
  pluginService: PluginService;
  constructor(pluginService: PluginService) {
    this.pluginService = pluginService;
  }

  async load(treat: Treat): Promise<Either<Error, Array<TreatItem>>> {
    const { treatSource, config, modifiers } = treat;

    let treatSourceItems = await new TreatSourceItemLoader(
      this.pluginService
    ).load(treatSource, config);
    console.log(treatSourceItems);

    if (isLeft(treatSourceItems)) {
      return treatSourceItems;
    }

    const modifiedItems = treatSourceItems.right
      .map(applyModifiers(modifiers))
      .filter((item): item is Right<TreatSourceItem> => {
        return isRight(item);
      })
      .map((item) => item.right);

    const treatItems = modifiedItems.map((i) => fromTreatSourceItem(treat, i));
    return right(sort(treatItems));
  }

  async loadAll(
    treats: Array<Treat>
  ): Promise<Either<Error, Array<TreatItem>>> {
    let items: Array<TreatItem> = [];
    for (let treat of treats) {
      const _items = await this.load(treat);
      if (isLeft(_items)) {
        return _items;
      }
      items = items.concat(_items.right);
    }
    return right(sort(items));
  }
}

function fromTreatSourceItem(
  treat: Treat,
  treatSourceItem: TreatSourceItem
): TreatItem {
  return {
    ...treatSourceItem,
    idTreat: treat.id,
  };
}
