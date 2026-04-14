export type InstagramFeedItem = {
  id: string;
  permalink: string;
  imageUrl: string;
  mediaType?: string;
};

export type InstagramFeedFile = {
  items: InstagramFeedItem[];
  fetchedAt: string | null;
};

export function isInstagramFeedFile(x: unknown): x is InstagramFeedFile {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return Array.isArray(o.items);
}
