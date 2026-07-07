import type { SceneManifest } from '@max/ui';

/**
 * Exploded bike scene manifest. The hero reuses the two finished bike photos:
 * `base` is the assembled bike, and a single full-frame `exploded-view` layer
 * cross-fades in on explode (matching the standalone prototype). The remaining
 * parts carry only a hotspot (their image layer is transparent), positioned over
 * the exploded photo, so each still opens its price popover.
 *
 * Drop-in: replace assembled.jpg / exploded.jpg in public/scenes/ecobike/ to swap
 * the artwork; hotspot percentages are tuned to the exploded photo. The current
 * artwork is a conventional (non-electric) city bike, so there is no battery,
 * mid-motor or display — hotspots cover the frame, wheels, rack, mudguards,
 * chain guard, chain, crank, saddle and handlebar.
 */
export const ebikeScene: SceneManifest = {
  id: 'ebike',
  aspectRatio: '1567 / 1004',
  base: { src: '/scenes/ecobike/assembled.jpg', alt: 'Stadsfiets in de werkplaats', width: 1567, height: 1004 },
  parts: [
    // Full exploded photo — fades in when the scene explodes (no hotspot of its own).
    {
      id: 'exploded-view',
      label: 'Onderdelen',
      src: '/scenes/ecobike/exploded.jpg',
      alt: 'Opengewerkte fiets met losse onderdelen',
      zIndex: 0,
      assembled: { opacity: 0 },
      exploded: { opacity: 1 },
    },
    // Hotspot-only parts (transparent layer) anchored to the exploded photo.
    { id: 'frame', label: 'Frame', zIndex: 1, assembled: { opacity: 0 }, exploded: { opacity: 0 }, hotspot: { xPct: 54, yPct: 44 }, priceKey: 'frame' },
    { id: 'rack', label: 'Bagagedrager', zIndex: 1, assembled: { opacity: 0 }, exploded: { opacity: 0 }, hotspot: { xPct: 20, yPct: 33 }, priceKey: 'rack' },
    { id: 'mudguards', label: 'Spatborden', zIndex: 1, assembled: { opacity: 0 }, exploded: { opacity: 0 }, hotspot: { xPct: 80, yPct: 47 }, priceKey: 'mudguards' },
    { id: 'saddle', label: 'Zadel', zIndex: 1, assembled: { opacity: 0 }, exploded: { opacity: 0 }, hotspot: { xPct: 35, yPct: 14 }, priceKey: 'saddle' },
    { id: 'handlebar', label: 'Stuur', zIndex: 1, assembled: { opacity: 0 }, exploded: { opacity: 0 }, hotspot: { xPct: 67, yPct: 12 }, priceKey: 'handlebar' },
    { id: 'chainguard', label: 'Kettingkast', zIndex: 1, assembled: { opacity: 0 }, exploded: { opacity: 0 }, hotspot: { xPct: 42, yPct: 71 }, priceKey: 'chainguard' },
    { id: 'chain', label: 'Ketting', zIndex: 1, assembled: { opacity: 0 }, exploded: { opacity: 0 }, hotspot: { xPct: 29, yPct: 74 }, priceKey: 'chain' },
    { id: 'crank', label: 'Crank & pedalen', zIndex: 1, assembled: { opacity: 0 }, exploded: { opacity: 0 }, hotspot: { xPct: 52, yPct: 73 }, priceKey: 'crank' },
    { id: 'front-wheel', label: 'Voorwiel', zIndex: 1, assembled: { opacity: 0 }, exploded: { opacity: 0 }, hotspot: { xPct: 87, yPct: 63 }, priceKey: 'wheel' },
    { id: 'rear-wheel', label: 'Achterwiel', zIndex: 1, assembled: { opacity: 0 }, exploded: { opacity: 0 }, hotspot: { xPct: 14, yPct: 63 }, priceKey: 'wheel' },
  ],
};

/**
 * Indicative part prices for the click-to-price popover.
 * TODO(client): confirm real material + service figures (see BLOCKERS.md, WS6c).
 * These are placeholders so the interaction can be reviewed.
 */
export const PART_PRICES: Record<string, { material?: string; service: string }> = {
  frame: { service: 'Constructiecheck — vanaf €25' },
  wheel: { material: 'Band + binnenband v.a. €25', service: 'Wielservice v.a. €20' },
  handlebar: { material: 'Grips/kabels v.a. €10', service: 'Afstellen v.a. €15' },
  saddle: { material: 'Zadel v.a. €25', service: 'Afstellen v.a. €10' },
  crank: { service: 'Lagerservice v.a. €30' },
  chain: { material: 'Ketting v.a. €20', service: 'Vervangen + smeren v.a. €15' },
  rack: { material: 'Bagagedrager v.a. €25', service: 'Monteren v.a. €15' },
  mudguards: { material: 'Spatborden v.a. €20', service: 'Monteren v.a. €15' },
  chainguard: { material: 'Kettingkast v.a. €25', service: 'Afstellen v.a. €15' },
};
