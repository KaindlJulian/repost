/**
 * Filters an array with a callback that may be async
 */
export async function asyncFilter<T>(
  array: Array<T>,
  predicate: (
    value: T,
    index?: number,
    array?: Array<T>
  ) => Promise<boolean> | boolean
) {
  const booleanMapping = await Promise.all(array.map(predicate));
  return array.filter((_, i) => booleanMapping[i]);
}
