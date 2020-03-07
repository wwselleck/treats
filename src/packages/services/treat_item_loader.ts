import { Treat, TreatItem, TreatSourceItem } from "../core";
import { TreatSourceItemLoader } from "./treat_source_item_loader";

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
    const sortedTreatItems = treatItems.sort((i1, i2) => i2.score - i1.score);
    return sortedTreatItems;
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
