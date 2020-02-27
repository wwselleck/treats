import { Treat, TreatItem } from "../treat";
import {
  TreatSource,
  TreatSourceItem,
  TreatSourceConfig
} from "../treat_source";

function treatItemFromTreatSourceItem(
  treat: Treat,
  treatSourceItem: TreatSourceItem
): TreatItem {
  return {
    ...treatSourceItem,
    idTreat: treat.id
  };
}
export interface TreatSourceItemLoader {
  load(
    treatSource: TreatSource,
    config: TreatSourceConfig
  ): Promise<Array<TreatSourceItem>>;
}

export class ItemLoader {
  treatSourceItemLoader: TreatSourceItemLoader;

  constructor(treatSourceItemLoader: TreatSourceItemLoader) {
    this.treatSourceItemLoader = treatSourceItemLoader;
  }

  async load(treat: Treat): Promise<Array<TreatItem>> {
    const { treatSource, config } = treat;
    const items = await this.treatSourceItemLoader.load(treatSource, config);
    return items.map(treatSourceItem =>
      treatItemFromTreatSourceItem(treat, treatSourceItem)
    );
  }
}
