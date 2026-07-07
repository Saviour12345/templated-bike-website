/**
 * Scene manifest types for interactive heroes (Workstream 6). One manifest per
 * scene maps each part → its layer image, default + exploded transforms, z-index,
 * hotspot position, and the CMS price key for the click-to-price popover.
 *
 * Authored as JSON in each app (apps/<app>/scenes/<scene>.ts) and produced by
 * the asset pipeline (scripts/build-scene-manifest). Layer `src` may be empty until
 * the Nano Banana Pro assets land — ExplodedScene renders a labelled placeholder
 * block in that case, so the interaction is reviewable before assets exist.
 */
export interface PartTransform {
  /** px translate */
  x?: number;
  y?: number;
  scale?: number;
  /** degrees */
  rotate?: number;
  opacity?: number;
}

export interface ScenePart {
  id: string;
  label: string;
  /** Transparent layer image (webp/avif), aligned to the master frame. */
  src?: string;
  alt?: string;
  zIndex?: number;
  /** Resting (assembled) transform. */
  assembled?: PartTransform;
  /** Apart (exploded) transform. */
  exploded?: PartTransform;
  /** Hotspot anchor as % of the scene box. */
  hotspot?: { xPct: number; yPct: number };
  /** Key into the CMS price map: { material, service } or a range. */
  priceKey?: string;
}

export interface SceneManifest {
  id: string;
  /** Static fallback / LCP base image (assembled master, or exploded diagram). */
  base: { src?: string; alt: string; width: number; height: number };
  /** CSS aspect-ratio, e.g. "16 / 9". */
  aspectRatio?: string;
  parts: ScenePart[];
}
