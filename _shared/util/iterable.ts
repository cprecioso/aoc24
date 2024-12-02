const unassigned = Symbol("unassigned");
export const pairwise = function* <T>(
  source: Iterable<T>,
): Iterable<[last: T, current: T]> {
  let last: T | typeof unassigned = unassigned;
  for (const item of source) {
    if (last !== unassigned) yield [last, item];
    last = item;
  }
};
