export const ArrayPositionPipe = {
  fn(scores: Array<[any, number]>): Array<[any, number]> {
    const totalItems = scores.length;

    return scores.map(([item, score], i) => {
      const baseMultiplier = 1;
      const multiplierFloor = 0.8;
      const multiplierDistance = baseMultiplier - multiplierFloor;

      const multiplier = baseMultiplier - multiplierDistance * (i / totalItems);
      return [item, score * multiplier];
    });
  }
};
