export function extractPostId(url: string): string | null {
  const regex = /status\/(\d+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
