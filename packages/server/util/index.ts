export function indexArray<T extends { [key: string]: any }, K extends keyof T>(
  arr: Array<T>,
  by: K
): Record<string, T> {
  return arr.reduce((acc, curr) => {
    return {
      ...acc,
      [curr[by]]: curr
    };
  }, {} as Record<string, T>);
}
