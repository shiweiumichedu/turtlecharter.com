import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
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
