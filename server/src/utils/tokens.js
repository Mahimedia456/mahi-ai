export function estimateTokens(text = "") {
  if (!text) return 0;
  return Math.ceil(String(text).length / 4);
}