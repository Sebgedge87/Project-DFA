/**
 * Build the public share URL for an army list.
 * baseUrl should be the app root, e.g. https://dfa.app
 */
export function buildShareUrl(baseUrl: string, shareToken: string): string {
  return `${baseUrl.replace(/\/$/, '')}/share/${shareToken}`;
}

/**
 * Extract the share token from a full share URL.
 * Returns null if the URL does not match the expected pattern.
 */
export function extractShareToken(url: string): string | null {
  const match = url.match(/\/share\/([^/?#]+)/);
  return match ? match[1] : null;
}
