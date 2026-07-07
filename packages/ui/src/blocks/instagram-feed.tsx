import Image from 'next/image';
import { cn } from '../lib/cn';
import type { InstagramPost } from '../lib/types';
import { hoverZoomImage } from '../motion/hover';
import { ArrowRightIcon } from '../primitives/icons';

export interface InstagramFeedProps {
  /** Self-hosted posts. Renders nothing when empty (no broken placeholder). */
  posts: InstagramPost[];
  /** Cap the number of tiles shown (e.g. 6). Defaults to all posts. */
  max?: number;
  /** "Follow @handle" CTA — rendered only when both label and url are set. */
  followLabel?: string;
  profileUrl?: string;
  className?: string;
}

/**
 * Curated, self-hosted Instagram grid (3 tiles on mobile → 6 on desktop).
 *
 * - Images are served from our own CDN via next/image (AVIF/WebP), with a fixed
 *   square aspect ratio → zero CLS, and lazy-loaded (kept off the LCP path).
 * - Each tile links out to its original `permalink` in a new tab.
 * - Hover zoom is transform-only and `motion-safe:` gated (reduced-motion aware).
 * - Makes ZERO third-party browser requests, so it needs no consent gate.
 */
export function InstagramFeed({ posts, max, followLabel, profileUrl, className }: InstagramFeedProps) {
  const tiles = typeof max === 'number' ? posts.slice(0, max) : posts;
  if (tiles.length === 0) return null;
  // With ≤3 posts, stay 3-up on desktop so the tiles fill the block instead of
  // occupying half of a 6-column row.
  const sixUp = tiles.length > 3;

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <ul className={cn('grid grid-cols-3 gap-2 sm:gap-3', sixUp && 'lg:grid-cols-6')}>
        {tiles.map((post, i) => (
          <li key={`${post.permalink}-${i}`}>
            <a
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden rounded-lg border border-border bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
            >
              <Image
                src={post.src}
                alt={post.alt}
                fill
                loading="lazy"
                sizes={sixUp ? '(max-width: 1024px) 33vw, 16vw' : '(max-width: 1280px) 33vw, 400px'}
                className={cn('object-cover', hoverZoomImage)}
              />
              {post.caption && (
                <span className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2 text-xs text-white opacity-0 transition-opacity duration-200 ease-brand motion-safe:group-hover:opacity-100">
                  <span className="line-clamp-2">{post.caption}</span>
                </span>
              )}
            </a>
          </li>
        ))}
      </ul>

      {followLabel && profileUrl && (
        <a
          href={profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          data-track="social_click"
          data-track-channel="instagram"
          className="inline-flex items-center gap-2 self-start text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
        >
          {followLabel}
          <ArrowRightIcon className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
