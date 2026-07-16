# Local Spot Maps — Design

**Date:** 2026-07-16
**Status:** Approved

## Problem

The "景点地图" (sightseeing spot map) on destination detail pages is a Leaflet map
that fetches Esri World Imagery satellite tiles from `server.arcgisonline.com`
at page load. This is a runtime dependency on a third-party service — slow or
flaky for visitors in China, and a single point of failure. The user wants the
map imagery saved locally so pages render with zero external requests.

## Decisions (made with user)

1. **Static local image, clickable** — the interactive Leaflet map is replaced
   by a locally-hosted satellite image. The whole image links to the
   destination's `mapUrl` (Google Maps satellite) in a new tab for visitors who
   want to pan/zoom.
2. **Plain background + HTML overlay pins** — the saved image contains only
   satellite imagery. Pins and labels are rendered as HTML positioned over the
   image, so one image serves both zh and en locales (labels differ per
   locale), text stays crisp, and spot edits don't require regenerating images
   (unless the map area grows).
3. **Keep Esri imagery** — user accepted the licensing gray area (six one-time
   stitched images, attribution kept) over switching to non-satellite OSM.

## Components

### 1. `scripts/build-spot-maps.mjs` (new)

Run manually (`node scripts/build-spot-maps.mjs`) whenever spots change enough
to alter a map's area.

- Parses `spots` frontmatter from `src/content/destinations/*.md`.
- For each destination with spots, replicates Leaflet's `fitBounds` logic
  (padding `[45, 45]`, `maxZoom: 14`) against a target viewport (~800×440 CSS
  px) to select the same zoom and geographic bounds users see today.
- Downloads the Esri World Imagery tiles covering that area at the chosen
  zoom, stitches them with `sharp`, and crops to the exact bounds.
- Outputs:
  - `public/maps/{slug}.jpg` — 2× resolution (~1600×880) JPEG.
  - `src/data/spot-map-bounds.json` — per-slug `{ north, south, east, west,
    width, height }` describing exactly what the image covers.

### 2. `SpotMap.astro` (rewrite)

- Props: `slug`, `spots` (lat/lng/label), `href` (interactive-map link).
- Renders an `<a target="_blank">` wrapping a container with the local image;
  `aspect-ratio` CSS from the bounds metadata instead of a fixed height.
- Each spot converted lat/lng → percent position using **Web Mercator**
  projection (linear latitude interpolation is wrong) against the saved
  bounds; rendered as the existing orange pin + dark label chip styling.
- Esri attribution caption kept on the image (required by terms).
- No `<script>` tag, no Leaflet import — zero runtime JS and zero external
  requests.

### 3. Callers — `src/pages/destinations/[slug].astro` + en variant

- Pass `slug` and `mapUrl` through to `SpotMap`.
- Destinations without `spots` keep the existing plain `mapUrl` link fallback,
  unchanged.

### 4. Cleanup

- Remove `leaflet` (+ types) from `package.json`.
- e2e (`tests/e2e/destinations.spec.ts`): assert the local map image loads
  (response 200 from `/maps/...`) and pins/labels render.

## Error handling

- Script: fail loudly (non-zero exit) on any tile download or stitch error;
  no partial writes of the bounds JSON.
- Page build: if a destination has `spots` but no entry in the bounds JSON /
  no image, the build should fail with a clear message telling the developer
  to run the script — not silently render a broken map.

## Testing

- Run the generation script; visually inspect the six images.
- Dev server: verify zh and en destination pages render the map with pins in
  correct positions (compare against the old Leaflet view).
- Playwright e2e passes.
