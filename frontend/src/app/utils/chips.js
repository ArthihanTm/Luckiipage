/** Whole chips only — no fractional balance. */
export function normalizeChips(n) {
  const x = Number(n);
  if (!Number.isFinite(x)) return 0;
  return Math.max(0, Math.floor(x));
}

/** Display chips as a grouped integer (no decimals). */
export function formatChips(n) {
  return normalizeChips(n).toLocaleString(undefined, { maximumFractionDigits: 0 });
}
