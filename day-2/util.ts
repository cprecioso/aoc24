export const check = <T>(
  item: T,
  fn: (item: T) => boolean,
) => fn(item);

export const checkWithDampen = <T>(
  list: readonly T[],
  fn: (list: readonly T[]) => boolean,
) => {
  const indices = list.map((_, i) => i);
  for (const index of indices) {
    const splicedList = list.toSpliced(index, 1);
    const result = fn(splicedList);
    if (result) return true;
  }
  return false;
};
