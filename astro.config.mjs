// @ts-check
import { defineConfig } from 'astro/config';

// turtlecharter.com — bilingual site.
// 中文 (zh) is the default locale, served at the root with NO prefix.
// English (en) is served under /en/.
export default defineConfig({
  site: 'https://turtlecharter.com',
  // 'file' format + no forced trailing slash → deterministic URLs like /contact
  // and /en/contact (matches the language-switch links and e2e expectations).
  build: { format: 'file' },
  trailingSlash: 'ignore',
  i18n: {
    defaultLocale: 'zh',
    locales: ['zh', 'en'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
