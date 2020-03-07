import { Result, ok } from "../types/result";

import { Treat, TreatItem, TreatSourceItem } from "../core";
import { TreatSourceItemLoader } from "./treat_source_item_loader";

class TreatItemSorter {
  static sort(items: Array<TreatItem>) {
    const sortedTreatItems = items.sort((i1, i2) => i2.score - i1.score);
    return sortedTreatItems;
  }
}

export class TreatItemLoader {
  static async load(treat: Treat): Promise<Array<TreatItem>> {
    const { treatSource, config } = treat;

    let treatSourceItems = await TreatSourceItemLoader.load(
      treatSource,
      config
    );
    const treatItems = treatSourceItems.map(i =>
      treatItemFromTreatSourceItem(treat, i)
    );
    return TreatItemSorter.sort(treatItems);
  }

  static async loadAll(
    treats: Array<Treat>
  ): Promise<Result<Array<TreatItem>>> {
    let items: Array<TreatItem> = [];
    for (let treat of treats) {
      const _items = await this.load(treat);
      items = items.concat(_items);
    }
    return ok(TreatItemSorter.sort(items));
  }
}

function treatItemFromTreatSourceItem(
  treat: Treat,
  treatSourceItem: TreatSourceItem
): TreatItem {
  return {
    ...treatSourceItem,
    idTreat: treat.id
  };
}
