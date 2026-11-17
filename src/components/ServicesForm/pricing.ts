// Rounds to 2 decimal places to represent USD cents, avoiding floating-point drift (e.g. 0.1 + 0.2).
export const roundCurrency = (n: number | string): number =>
  Math.round((Number(n) + Number.EPSILON) * 100) / 100;
