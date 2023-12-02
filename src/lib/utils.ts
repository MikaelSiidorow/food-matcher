export const shuffle = <T>(array: readonly T[] | T[]) => array.toSorted(() => Math.random() - 0.5);
