import 'server-only';
import type { ArticledataEntry, ArticledataResponse } from './types';

/**
 * Server-only CycleSoftware Articledata V4 client (CYCLESOFTWARE-SYNC plan, Phase 1).
 *
 * Credentials are SECRETS (HTTP Basic against api.cyclesoftware.nl) — this module
 * imports `server-only`, so importing it from a Client Component is a build error.
 *
 * Caching follows the site's established third-party pattern (google-places.ts,
 * instagram.ts): the paginated fetches go through Next's Data Cache with
 * `revalidate` (default 15 min) + the `cyclesoftware` tag. The cron route
 * (/api/cron/sync-inventory) calls `revalidateTag(CS_CACHE_TAG)` to force a refresh
 * outside the revalidate window. There is deliberately no KV/Edge Config layer and
 * no `modified_since` incremental sync: nothing persists state between runs, the
 * catalog is a small local-shop inventory, and a full pull per revalidation is
 * cheaper than maintaining a sync cursor. Revisit if the catalog outgrows a few
 * pages.
 *
 * Returns `null` on missing creds / non-OK / error so callers fall back to the seed
 * catalog and the build never breaks.
 */

export const CS_CACHE_TAG = 'cyclesoftware';

const API_ORIGIN = 'https://api.cyclesoftware.nl';
const ENTRIES_URL = `${API_ORIGIN}/api/v4/articledata/entries.json?per_store_id=true`;
/** Hard cap on pagination follows — guards against a next_url loop. */
const MAX_PAGES = 25;

const DEFAULT_REVALIDATE_SECONDS = 900;

function revalidateSeconds(): number {
  const raw = Number(process.env.CYCLESOFTWARE_REVALIDATE_SECONDS);
  return Number.isFinite(raw) && raw > 0 ? Math.floor(raw) : DEFAULT_REVALIDATE_SECONDS;
}

export function isCycleSoftwareConfigured(): boolean {
  return Boolean(process.env.CYCLESOFTWARE_API_USER && process.env.CYCLESOFTWARE_API_PASSWORD);
}

function basicAuthHeader(): string {
  const user = process.env.CYCLESOFTWARE_API_USER ?? '';
  const password = process.env.CYCLESOFTWARE_API_PASSWORD ?? '';
  return `Basic ${Buffer.from(`${user}:${password}`).toString('base64')}`;
}

/**
 * Only follow pagination onto the CS API host itself — a hijacked/malformed
 * `next_url` must never make us send Basic credentials elsewhere.
 */
function resolveNextUrl(nextUrl: string | null | undefined): string | null {
  if (!nextUrl) return null;
  try {
    const url = new URL(nextUrl, API_ORIGIN);
    if (url.protocol !== 'https:' || url.origin !== API_ORIGIN) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Fetch ALL articledata entries (follows `pagination.next_url`).
 *
 * @param opts.noStore bypass the Data Cache — used by the cron route to verify the
 *   API is reachable with fresh data before it invalidates the cached copy.
 */
export async function fetchArticledataEntries(opts?: { noStore?: boolean }): Promise<ArticledataEntry[] | null> {
  if (!isCycleSoftwareConfigured()) return null;

  const cacheOptions: RequestInit & { next?: { revalidate: number; tags: string[] } } = opts?.noStore
    ? { cache: 'no-store' }
    : { next: { revalidate: revalidateSeconds(), tags: [CS_CACHE_TAG] } };

  try {
    const entries: ArticledataEntry[] = [];
    let url: string | null = ENTRIES_URL;

    for (let page = 0; url && page < MAX_PAGES; page++) {
      const res: Response = await fetch(url, {
        headers: { Authorization: basicAuthHeader(), Accept: 'application/json' },
        ...cacheOptions,
      });
      if (!res.ok) return null;

      const body = (await res.json()) as ArticledataResponse;
      entries.push(...(body.data ?? []));
      url = resolveNextUrl(body.pagination?.next_url);
    }

    return entries;
  } catch {
    return null;
  }
}
