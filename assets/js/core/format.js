/** Number formatting shared by the UI classes. */

/** 987809 -> "988k", 2091423 -> "2,1tr", 5210 -> "5,2k", small numbers unchanged. Vietnamese decimal comma. */
export function compactNumber(n) {
  const oneDecimal = (value) => value.toFixed(1).replace('.', ',').replace(/,0$/, '');
  if (n >= 1_000_000) return `${oneDecimal(n / 1_000_000)}tr`;
  if (n >= 10_000) return `${Math.round(n / 1000)}k`;
  if (n >= 1000) return `${oneDecimal(n / 1000)}k`;
  return String(n);
}
