export function removeTags(text: string): string {
  return text.replace(/@\w+/g, "").trim();
}
