import { Result, ok, isError, map } from "../types/result";

import { Treat, TreatItem, TreatSourceItem, Item, Modifier } from "../core";
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

  async load(treat: Treat): Promise<Result<Array<TreatItem>>> {
    const { treatSource, config, modifiers } = treat;

    let treatSourceItems = await new TreatSourceItemLoader(
      this.pluginService
    ).load(treatSource, config);

    if (isError(treatSourceItems)) {
      return treatSourceItems;
    }

    const modifiedItems = map<TreatSourceItem>(applyModifiers(modifiers))(
      treatSourceItems.value
    );

    if (isError(modifiedItems)) {
      return modifiedItems;
    }

    const treatItems = modifiedItems.value.map((i) =>
      fromTreatSourceItem(treat, i)
    );
    return ok(sort(treatItems));
  }

  async loadAll(treats: Array<Treat>): Promise<Result<Array<TreatItem>>> {
    let items: Array<TreatItem> = [];
    for (let treat of treats) {
      const _items = await this.load(treat);
      if (isError(_items)) {
        return _items;
      }
      items = items.concat(_items.value);
    }
    return ok(sort(items));
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
