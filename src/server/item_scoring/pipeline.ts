import { Item } from "../core";

interface Pipe<ItemType> {
  fn: (scores: Array<[ItemType, number]>) => Array<[ItemType, number]>;
}

interface ScoringPipelineConfig {
  baseScore: number;
}
function applyConfigDefaults(config?: Partial<ScoringPipelineConfig>) {
  return {
    baseScore: 500,
    ...config
  };
}

export class ScoringPipeline<ItemType> {
  config: ScoringPipelineConfig;
  pipes: Array<Pipe<ItemType>>;

  constructor(
    pipes: Array<Pipe<ItemType>>,
    config?: Partial<ScoringPipelineConfig>
  ) {
    this.config = applyConfigDefaults(config);
    this.pipes = pipes;
  }

  score(items: Array<ItemType>): Array<ItemType> {
    const initialItemScores: Array<[ItemType, number]> = items.map(i => [
      i,
      this.config.baseScore
    ]);

    let itemScores = initialItemScores;

    for (const pipe of this.pipes) {
      const newItemScores = pipe.fn(itemScores);
      itemScores = newItemScores;
    }

    return applyScores(itemScores);
  }
}

function applyScores<ItemType>(
  itemScores: Array<[ItemType, number]>
): Array<ItemType> {
  return itemScores.map(([item, score]) => ({
    ...item,
    score
  }));
}
