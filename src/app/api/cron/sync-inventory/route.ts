import { NextResponse } from 'next/server';
import { revalidateTag } from 'next/cache';
import { CS_CACHE_TAG, fetchArticledataEntries, isCycleSoftwareConfigured } from '@/lib/cyclesoftware/client';
import { mapArticledataToListings } from '@/lib/cyclesoftware/map-to-listing';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * CycleSoftware inventory sync (CYCLESOFTWARE-SYNC plan, Phase 2).
 *
 * Scheduled by apps/eco-bike/vercel.json ("crons") — Vercel calls this daily and
 * automatically sends `Authorization: Bearer $CRON_SECRET` (same lockdown pattern
 * as magic-touch's refresh-instagram cron). Intraday freshness does NOT depend on
 * this route: the Articledata fetches in lib/cyclesoftware/client.ts sit in Next's
 * Data Cache with a 15-minute revalidate, so listings refresh with traffic. This
 * route exists to (a) force-refresh on demand — hit it manually after the shop
 * marks a bike sold — and (b) report sync health in one place (Vercel logs).
 * Daily schedule because Hobby-plan crons can't run more often.
 *
 * Flow: verify the API answers with FRESH data (no-store) → only then invalidate
 * the cached copy (`revalidateTag`) so the next page render refetches. If CS is
 * down we leave the cache untouched — pages keep serving the last good listings
 * (or the seed catalog) instead of flushing them for nothing.
 */
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
    }
  }

  if (!isCycleSoftwareConfigured()) {
    // Expected state until Phase 0 (client enables CS Connect) completes — not an error.
    return NextResponse.json({ ok: false, reason: 'cyclesoftware_not_configured' });
  }

  const entries = await fetchArticledataEntries({ noStore: true });
  if (!entries) {
    console.error('[sync-inventory] CycleSoftware Articledata fetch failed; cache left untouched');
    return NextResponse.json({ ok: false, error: 'cyclesoftware_fetch_failed' }, { status: 502 });
  }

  revalidateTag(CS_CACHE_TAG);

  const listings = mapArticledataToListings(entries, 'nl', {
    storeId: process.env.CYCLESOFTWARE_STORE_ID || undefined,
  });
  console.log(`[sync-inventory] ok — ${entries.length} entries → ${listings.length} sellable listings`);
  return NextResponse.json({
    ok: true,
    entries: entries.length,
    listings: listings.length,
    syncedAt: new Date().toISOString(),
  });
}
