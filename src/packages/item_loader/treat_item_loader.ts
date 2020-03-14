import { Result, ok, isError, isOk } from "../types/result";

import { Treat, TreatItem, TreatSourceItem } from "../core";
import { PluginService } from "../plugin";
import { TreatSourceItemLoader } from "./treat_source_item_loader";

class TreatItemSorter {
  static sort(items: Array<TreatItem>) {
    const sortedTreatItems = items.sort((i1, i2) => i2.score - i1.score);
    return sortedTreatItems;
  }
}

export class TreatItemLoader {
  pluginService: PluginService;
  constructor(pluginService: PluginService) {
    this.pluginService = pluginService;
  }

  async load(treat: Treat): Promise<Result<Array<TreatItem>>> {
    const { treatSource, config } = treat;

    let treatSourceItems = await new TreatSourceItemLoader(
      this.pluginService
    ).load(treatSource, config);

    if (isError(treatSourceItems)) {
      return treatSourceItems;
    }

    const treatItems = treatSourceItems.value.map(i =>
      treatItemFromTreatSourceItem(treat, i)
    );
    return ok(TreatItemSorter.sort(treatItems));
  }

  async loadAll(treats: Array<Treat>): Promise<Result<Array<TreatItem>>> {
    let items: Array<TreatItem> = [];
    for (let treat of treats) {
      const _items = await this.load(treat);
      if (isOk(_items)) {
        console.log(_items);
        items = items.concat(_items.value);
      }
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
