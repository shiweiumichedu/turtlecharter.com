import { defineConfig } from 'vitest/config';

// Unit tests for pure logic (i18n utilities, formatting helpers).
// Rendered/browser behavior is covered by Playwright (test:e2e), not here.
export default defineConfig({
  test: {
    include: ['tests/unit/**/*.test.ts'],
    environment: 'node',
  },
});
