export function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

export function groupBy<T, K extends string | number | symbol>(
  array: T[],
  key: (item: T) => K
): Record<K, T[]> {
  return array.reduce(
    (result, item) => {
      const k = key(item);
      if (!result[k]) {
        result[k] = [];
      }
      result[k].push(item);
      return result;
    },
    {} as Record<K, T[]>
  );
}

export function sumBy<T>(array: T[], selector: (item: T) => number): number {
  return array.reduce((sum, item) => sum + selector(item), 0);
}

export function sortBy<T>(array: T[], selector: (item: T) => unknown, ascending: boolean = true): T[] {
  return [...array].sort((a, b) => {
    const aVal = selector(a);
    const bVal = selector(b);
    if (aVal < bVal) return ascending ? -1 : 1;
    if (aVal > bVal) return ascending ? 1 : -1;
    return 0;
  });
}

export function filterBy<T>(array: T[], predicate: (item: T) => boolean): T[] {
  return array.filter(predicate);
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function roundTo(value: number, decimals: number = 2): number {
  return Math.round(value * Math.pow(10, decimals)) / Math.pow(10, decimals);
}
