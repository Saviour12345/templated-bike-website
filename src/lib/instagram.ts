import 'server-only';
import { cache } from 'react';
import type { InstagramPost } from '@max/ui';

/**
 * Server-only Instagram Graph API fetcher for the live "latest posts" block.
 *
 * The access token is a SECRET — this module imports `server-only`, so importing it
 * from a Client Component is a build error. Never import this (or content/social) from
 * a 'use client' file; pass the resolved data down as a serializable prop instead.
 *
 * One cached call per render (React `cache`) and one network call per day
 * (`revalidate: 86400`). Returns `null` on missing token / non-OK / error / empty so
 * callers fall back to hiding the Instagram section and the build never breaks.
 *
 * Images are never hotlinked: `media_url`/`thumbnail_url` are Instagram's own signed,
 * expiring CDN URLs. Callers must render them through next/image (see
 * next.config.mjs remotePatterns for *.cdninstagram.com / *.fbcdn.net) so the browser
 * only ever requests our own domain.
 */

const GRAPH_VERSION = 'v21.0';

interface GraphMediaItem {
  id: string;
  caption?: string;
  media_type?: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
  timestamp?: string;
}
interface GraphMediaResponse {
  data?: GraphMediaItem[];
}

function toMediaType(type: GraphMediaItem['media_type']): InstagramPost['mediaType'] {
  if (type === 'VIDEO') return 'video';
  if (type === 'CAROUSEL_ALBUM') return 'carousel';
  return 'image';
}

function toAlt(caption?: string): string {
  if (!caption) return 'Bike shop Instagram post';
  return caption.length > 140 ? `${caption.slice(0, 140)}…` : caption;
}

export const getInstagramMedia = cache(async (limit = 3): Promise<InstagramPost[] | null> => {
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  const userId = process.env.INSTAGRAM_USER_ID;
  if (!accessToken || !userId) return null;

  try {
    const fields = 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp';
    const url = `https://graph.facebook.com/${GRAPH_VERSION}/${userId}/media?fields=${fields}&limit=${limit}&access_token=${accessToken}`;
    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) return null;

    const data = (await res.json()) as GraphMediaResponse;
    const posts: InstagramPost[] = (data.data ?? [])
      .map((item): InstagramPost | null => {
        const src = item.media_type === 'VIDEO' ? item.thumbnail_url : item.media_url;
        if (!src || !item.permalink) return null;
        return {
          src,
          alt: toAlt(item.caption),
          // Rendered via `fill` (InstagramFeed component); not used for layout.
          width: 1080,
          height: 1080,
          caption: item.caption,
          permalink: item.permalink,
          mediaType: toMediaType(item.media_type),
        };
      })
      .filter((p): p is InstagramPost => p !== null);

    return posts.length > 0 ? posts : null;
  } catch {
    return null;
  }
});
