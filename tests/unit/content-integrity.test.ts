import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { resolveRef } from '../../src/content/queries';

// Guard over the *sample* content: every cross-reference must resolve.
// Uses the real resolveRef helper against data read from the actual files.
const CONTENT = resolve(process.cwd(), 'src/content');

function read(dir: string): { file: string; text: string }[] {
  const d = resolve(CONTENT, dir);
  return readdirSync(d)
    .filter((f) => /\.(md|ya?ml)$/.test(f))
    .map((f) => ({ file: f, text: readFileSync(resolve(d, f), 'utf8') }));
}

/** Extract a top-level scalar frontmatter field like `vehicle: hiace`. */
function scalar(text: string, key: string): string | undefined {
  const m = text.match(new RegExp(`^${key}:\\s*(\\S+)\\s*$`, 'm'));
  return m?.[1];
}

/** Extract all `vehicle_type: <x>` values (route pricing rows). */
function vehicleTypes(text: string): string[] {
  return [...text.matchAll(/^\s*-?\s*vehicle_type:\s*(\S+)\s*$/gm)].map((m) => m[1]);
}

const vehicles = read('vehicles').map((v) => ({
  slug: scalar(v.text, 'slug')!,
  type: scalar(v.text, 'type')!,
}));
const drivers = read('drivers').map((d) => ({ slug: scalar(d.text, 'slug')!, text: d.text }));
const routes = read('routes').map((r) => ({ slug: scalar(r.text, 'slug')!, text: r.text }));
const testimonials = read('testimonials').map((t) => ({ text: t.text, file: t.file }));
const destinations = read('destinations').map((d) => ({
  slug: scalar(d.text, 'slug')!,
  region: scalar(d.text, 'region'),
  image: scalar(d.text, 'image'),
}));

describe('sample content referential integrity', () => {
  it('every driver.vehicle resolves to a vehicle slug', () => {
    for (const d of drivers) {
      const ref = scalar(d.text, 'vehicle');
      if (ref) expect(resolveRef(vehicles, ref), `${d.slug} → ${ref}`).toBeDefined();
    }
  });

  it('every route pricing vehicle_type matches a known vehicle type', () => {
    const knownTypes = new Set(vehicles.map((v) => v.type));
    for (const r of routes) {
      for (const type of vehicleTypes(r.text)) {
        expect(knownTypes.has(type), `${r.slug} → ${type}`).toBe(true);
      }
    }
  });

  it('every testimonial route/driver reference resolves', () => {
    for (const t of testimonials) {
      const route = scalar(t.text, 'route');
      const driver = scalar(t.text, 'driver');
      if (route) expect(resolveRef(routes, route), `${t.file} → ${route}`).toBeDefined();
      if (driver) expect(resolveRef(drivers, driver), `${t.file} → ${driver}`).toBeDefined();
    }
  });
});

describe('destination content', () => {
  const PUBLIC = resolve(process.cwd(), 'public');

  it('every destination declares a region and an image', () => {
    for (const d of destinations) {
      expect(d.region, `${d.slug} region`).toBeTruthy();
      expect(d.image, `${d.slug} image`).toBeTruthy();
    }
  });

  it("every destination's image file exists under public/", () => {
    for (const d of destinations) {
      const file = resolve(PUBLIC, d.image!.replace(/^\//, ''));
      expect(existsSync(file), `${d.slug} → ${d.image}`).toBe(true);
    }
  });

  it('every route region has at least one destination image available', () => {
    const covered = new Set(destinations.map((d) => d.region));
    // Regions listed by routes should have imagery so route cards/heros render a cover.
    for (const r of routes) {
      const regions = [...r.text.matchAll(/^\s*-?\s*regions?:\s*\[([^\]]*)\]/gm)]
        .flatMap((m) => m[1].split(',').map((s) => s.trim()))
        .filter(Boolean);
      for (const region of regions) {
        expect(covered.has(region), `${r.slug} → ${region}`).toBe(true);
      }
    }
  });
});
