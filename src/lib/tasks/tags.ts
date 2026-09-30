/** Lowercase, strip `#` and invalid characters, drop empties and duplicates. */
export function normalizeTag(tag: string): string {
  return tag.toLowerCase().replace(/[^a-z0-9_-]/g, "");
}

export function normalizeTags(tags: string[]): string[] {
  return [...new Set(tags.map(normalizeTag).filter(Boolean))];
}
