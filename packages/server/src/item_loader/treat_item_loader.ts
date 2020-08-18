import {
  Treat,
  TreatItem,
  TreatSourceItem,
  TreatSourceService,
} from "@treats-app/core";
import { PluginService } from "../plugin";
import { TreatSourceItemLoader } from "./treat_source_item_loader";
import { applyModifiers } from "../modify";
import { logger } from "../logger";

function sort(items: Array<TreatItem>) {
  return items.sort((i1, i2) => i2.score - i1.score);
}

export class TreatItemLoader {
  pluginService: PluginService;
  treatSourceService: TreatSourceService;
  constructor(
    pluginService: PluginService,
    treatSourceService: TreatSourceService
  ) {
    this.pluginService = pluginService;
    this.treatSourceService = treatSourceService;
  }

  async load(treat: Treat): Promise<Array<TreatItem>> {
    const { idTreatSource, config, modifiers } = treat;

    const treatSource = await this.treatSourceService.get(idTreatSource);

    if (!treatSource) {
      throw new Error("No treat source");
    }

    let treatSourceItems = await new TreatSourceItemLoader(
      this.pluginService
    ).load(treatSource, config);

    const modifiedItems = treatSourceItems.map((item) => {
      try {
        return applyModifiers<TreatSourceItem>(modifiers)(item);
      } catch (e) {
        logger.warn(`Error applying modifiers to item ${item.id} ${e}`);
        return item;
      }
    });

    const treatItems = modifiedItems.map((i) => fromTreatSourceItem(treat, i));
    return sort(treatItems);
  }

  async loadAll(treats: Array<Treat>): Promise<Array<TreatItem>> {
    let items: Array<TreatItem> = [];
    for (let treat of treats) {
      const _items = await this.load(treat);
      items = items.concat(_items);
    }
    return sort(items);
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
