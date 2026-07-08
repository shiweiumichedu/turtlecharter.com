# turtlecharter.com — Architecture & Design Document

> **Status:** Draft for review · **Date:** 2026-07-07
> Review this document first. Once approved, it feeds the OpenSpec workflow (`/opsx:propose`) to generate proposal → specs → design → tasks.

---

## 1. Overview

**turtlecharter.com** is a bilingual marketing/brochure website for a **Yunnan (云南) private car-charter tour business (包车游)**, aimed at **overseas visitors**. The business offers a **one-stop, "pure-play" (纯玩)** private car + driver-guide service: the customer gets a dedicated vehicle and a local driver-guide, with flexible routes and no forced shopping stops.

The website's job is **not** to be a live booking engine. Its job is to:
1. Build trust (show real drivers, real vehicles, real routes, transparent pricing).
2. Make it effortless to start a conversation (inquiry form + WhatsApp/WeChat/email) that ends in a **free custom itinerary**.

### 1.1 Goals

| # | Goal |
|---|------|
| G1 | Present the business bilingually, with **中文 as the default/preferred language** and English as a first-class second language. |
| G2 | Showcase **drivers** (photos, languages, experience) and **vehicles** (type, capacity, comfort) credibly. |
| G3 | Present **classic Yunnan routes** with itineraries and **transparent per-vehicle/per-day charter pricing**. |
| G4 | Convert visitors into inquiries via a low-friction **contact / free-customization** flow. |
| G5 | Render fast and cleanly on **mobile / WAP**, since overseas tourists browse on phones, often on slow/roaming networks. |
| G6 | Be **cheap to run** (static hosting, near-zero cost) and **easy to extend** (add a driver/route without touching layout code). |

### 1.2 Non-goals (initial release)

- Online payment / real-time availability / seat inventory.
- User accounts / login.
- A blog/CMS content pipeline beyond the core content types.
- Native mobile apps.

These are deliberately deferred; the architecture below keeps the door open for them (see §11).

### 1.3 Target audience

Primarily **overseas leisure travelers** (English-speaking, plus Chinese-reading diaspora/visitors) planning a Yunnan trip. Implications: English must be genuinely good (not machine-translated filler); contact happens over **email and WeChat**; pricing should be understandable (currency, what's included/excluded); pages must survive spotty mobile connections.

---

## 2. Approved technical decisions

| Area | Decision | Rationale |
|------|----------|-----------|
| **Framework** | **Astro** (static site generation) | Content-heavy but not app-like. Astro ships ~zero JS by default → fast on mobile. First-class i18n and content collections fit the drivers/vehicles/routes model. |
| **i18n** | Astro i18n routing, **`zh` = default locale**, `en` second | Meets G1. Chinese served at root (`/`), English under `/en/`. |
| **Content** | **Git-based Markdown + YAML** via Astro content collections | Structured, version-controlled, free, no external CMS. Add a driver = add one file. |
| **Contact** | **Inquiry form** → serverless form service (Formspree / Web3Forms) → email; plus visible **email + WeChat** | Low friction (G4), keeps hosting fully static. |
| **Hosting** | **Static host** (Cloudflare Pages / Netlify / Vercel — TBD in §9) | Free tier, global CDN, HTTPS, good for overseas + China-adjacent latency. |
| **Styling** | Utility-first CSS (Tailwind) or scoped Astro styles — TBD | Mobile-first responsive; small footprint. |

---

## 3. Information architecture (sitemap)

Chinese is the default; English mirrors the same structure under `/en/`.

```
/                         首页 Home            — hero, value prop (一站式纯玩包车), highlights, CTAs
/routes                   经典路线 Routes       — list of classic Yunnan itineraries + pricing
/routes/{slug}            路线详情 Route detail  — day-by-day itinerary, price by vehicle, inclusions
/vehicles                 车辆 Vehicles         — fleet: types, seats, comfort, luggage, per-day rate
/drivers                  司机 Drivers          — driver-guide profiles (photo, languages, years)
/drivers/{slug}           司机详情 Driver detail  — full bio, languages, specialties, photos
/about                    关于我们 About         — who we are, why "纯玩", trust signals
/testimonials             客户评价 Testimonials  — reviews from past overseas guests
/faq                      常见问题 FAQ           — pricing, inclusions, logistics, payment questions
/contact                  联系我们 Contact       — inquiry form + email/WeChat, free custom trip
```

English equivalents: `/en/`, `/en/routes`, `/en/routes/{slug}`, `/en/testimonials`, `/en/faq`, etc.

### 3.1 Global navigation

- Header: logo, primary nav (Home · Routes · Vehicles · Drivers · Testimonials · FAQ · About · Contact), **language switch (中/EN)**, prominent **"Get a free custom trip / 免费定制"** button. On mobile the nav collapses to a menu; secondary items (Testimonials, FAQ, About) may live under the menu / footer to keep the top bar clean.
- Footer: contact summary (email, WeChat QR), copyright, language switch, quick links.
- **Sticky mobile CTA:** a persistent "咨询 / Inquire" button on mobile that jumps to contact — key conversion driver on phones.

---

## 4. Content model

All content is stored as Astro **content collections**. Each entity is **language-aware**: bilingual fields live side by side so a single file drives both locales (avoids drift between zh/en versions).

### 4.1 `drivers`

```yaml
# src/content/drivers/lao-li.md
---
slug: lao-li
name_zh: 老李
name_en: Lao Li
photo: ./images/lao-li.jpg          # primary portrait
gallery: [./images/lao-li-2.jpg]    # optional extra photos
languages: [中文, English]           # spoken languages
years_experience: 12
regions: [大理, 丽江, 香格里拉]        # areas of expertise
vehicle: toyota-hiace               # ref to a vehicle (optional)
specialties_zh: [摄影点位, 高原路线, 家庭出游]
specialties_en: [Photo spots, Plateau routes, Family trips]
featured: true                      # show on home page
order: 1
---
# body: bilingual bio (zh block + en block, or split via frontmatter fields)
```

Design reference for driver presentation: **Ctrip 携程 localguide** Yunnan page (photo-forward cards with name, tags, experience).

### 4.2 `vehicles`

```yaml
# src/content/vehicles/toyota-hiace.yaml
slug: toyota-hiace
name_zh: 丰田海狮 (9座商务)
name_en: Toyota HiAce (9-seat van)
type: van                     # sedan | suv | van | minibus
seats: 9
luggage: 6                    # large suitcases
photo: ./images/hiace.jpg
features_zh: [空调, 宽敞, 适合家庭/小团]
features_en: [Air-conditioned, Spacious, Family / small group]
day_rate_cny: 1300            # per-day charter rate (baseline, e.g. 8h/300km)
day_rate_note_zh: 每日8小时/300公里，超出另计
day_rate_note_en: 8 hours / 300 km per day; extra usage billed separately
order: 2
```

### 4.3 `routes`

```yaml
# src/content/routes/kunming-dali-lijiang-shangri-la.md
---
slug: kunming-dali-lijiang-shangri-la
title_zh: 昆明·大理·丽江·香格里拉 经典环线
title_en: Kunming – Dali – Lijiang – Shangri-La Classic Loop
days: 6
cover: ./images/kdls-cover.jpg
regions: [昆明, 大理, 丽江, 香格里拉]
highlights_zh: [洱海, 玉龙雪山, 虎跳峡, 普达措]
highlights_en: [Erhai Lake, Jade Dragon Snow Mountain, Tiger Leaping Gorge, Pudacuo]
pricing_mode: package         # package | per_day  (routes can price either way)
pricing:                      # per-vehicle. If mode=package: total for the whole itinerary.
  - vehicle_type: sedan       #             If mode=per_day: rate per day for this route.
    price_cny: 4800
  - vehicle_type: van         # 7–9 seat
    price_cny: 7200
price_note_zh: 含油费、过路费、司机食宿；不含门票、住宿、正餐
price_note_en: Incl. fuel, tolls, driver's meals & lodging; excl. tickets, hotels, meals
featured: true
order: 1
---
## 行程 Itinerary  (day-by-day, bilingual)
Day 1 …
```

**Vehicle-charter pricing (both models).** The site presents pricing two ways so the business can quote whichever fits a trip:
- **Per-day rate** — lives on each **vehicle** (`day_rate_cny`, §4.2); shown on `/vehicles` and as the baseline for flexible/custom trips.
- **Per-route package** — lives on each **route** (`pricing_mode: package`, §4.3); a fixed total per vehicle type for that itinerary.
A route may also set `pricing_mode: per_day` to express its price as a daily rate instead of a package total. UI labels ("总价/package" vs "每日/per day") are driven by `pricing_mode`.

### 4.4 `testimonials`

```yaml
# src/content/testimonials/jane-uk.md
---
author_zh: Jane（英国）
author_en: Jane (UK)
avatar: ./images/jane.jpg            # optional
rating: 5                            # 1–5
route: kunming-dali-lijiang-shangri-la   # optional ref to a route
driver: lao-li                       # optional ref to a driver
date: 2026-04-12
featured: true
order: 1
---
quote_zh: 老李全程细心，行程灵活，没有任何购物…
quote_en: Lao Li was attentive the whole way, flexible itinerary, zero shopping stops…
```

### 4.5 `faq`

```yaml
# src/content/faq/whats-included.md
---
category: pricing            # pricing | booking | logistics | payment | general
order: 1
question_zh: 包车价格包含哪些？
question_en: What's included in the charter price?
---
# answer body: bilingual (zh block + en block)
含油费、过路费、停车费、司机食宿… / Includes fuel, tolls, parking, driver's meals & lodging…
```

### 4.6 Shared UI strings

Non-content UI text (nav labels, buttons, form labels, section headings) lives in **`src/i18n/{zh,en}.json`** dictionaries — separate from content collections.

### 4.7 Content-model diagram

```
                 ┌──────────────> vehicles <──(references)── drivers ──> regions[]
                 │                   ▲  (day_rate_cny)          │
routes ──(references)──> pricing[]   │                          │
   │  (pricing_mode)     keyed by vehicle_type                  │
   │                                                            │
testimonials ──(optional ref)──> routes / drivers ◀────────────┘
faq ──> category (taxonomy only)
```

---

## 5. Internationalization (i18n)

- **Default locale `zh`** served at the root; **`en`** under `/en/`. `astro.config` sets `i18n: { defaultLocale: 'zh', locales: ['zh','en'], routing: { prefixDefaultLocale: false } }`.
- **Language switch** preserves the current page (e.g. `/routes/x` ⇄ `/en/routes/x`) rather than dumping the user on the homepage.
- **`<html lang>`** set per locale; `hreflang` alternate tags for SEO.
- Bilingual **content** comes from per-field frontmatter (§4); bilingual **UI chrome** comes from JSON dictionaries (§4.6).
- **Fallback:** if an English field is missing, fall back to Chinese with a visual/accessibility note rather than showing blank.

---

## 6. Responsive / mobile / WAP strategy

- **Mobile-first** CSS; layouts scale up to desktop, not down.
- Lightweight, **lazy-loaded, responsive images** (Astro `<Image>` with width-appropriate variants + modern formats) — critical on roaming networks.
- **Near-zero client JS**: interactive bits (mobile menu, form, language switch, WeChat QR modal) are small islands; everything else is static HTML.
- Sticky mobile **inquiry CTA** (§3.1).
- Tap-friendly targets, legible type, high contrast for outdoor phone use.
- Performance budget target: **LCP < 2.5s on 4G**, minimal layout shift.

---

## 7. Contact / free-customization flow

The conversion core (G4). Present on `/contact` and reachable from every page.

1. **Inquiry form** — fields: name, email, WeChat ID (optional), intended dates, party size, route(s) of interest (prefilled when arriving from a route page), free-text message.
2. Submits to a **serverless form service** (Formspree or Web3Forms) that **emails the business** — no backend server needed; site stays static.
3. **Direct channels** shown alongside: **email** (mailto) and **WeChat QR** image. (WhatsApp intentionally excluded per business preference.)
4. **Spam control:** honeypot field + the form service's built-in protection.
5. **Confirmation:** inline success state; optional auto-reply from the form service.
6. **Prefill from context:** a "Book this route / 定制此路线" button on a route detail page opens `/contact` with that route preselected.

> **Open item:** choose Formspree vs Web3Forms (both have free tiers). Deferred to implementation; does not affect architecture.

---

## 8. Project structure (proposed)

```
turtlecharter.com/
├── astro.config.mjs           # i18n, integrations
├── package.json
├── src/
│   ├── content/
│   │   ├── config.ts          # zod schemas: drivers/vehicles/routes/testimonials/faq
│   │   ├── drivers/*.md
│   │   ├── vehicles/*.yaml
│   │   ├── routes/*.md
│   │   ├── testimonials/*.md
│   │   └── faq/*.md
│   ├── i18n/
│   │   ├── zh.json            # UI strings
│   │   ├── en.json
│   │   └── utils.ts           # locale helpers, path <-> locale
│   ├── components/            # Header, Footer, LangSwitch, DriverCard, VehicleCard,
│   │                          # RouteCard, PriceTable, TestimonialCard, FaqAccordion,
│   │                          # InquiryForm, WeChatQR …
│   ├── layouts/
│   │   └── BaseLayout.astro    # <html lang>, meta, hreflang, nav, footer
│   └── pages/
│       ├── index.astro                 # zh home (default locale at root)
│       ├── routes/index.astro
│       ├── routes/[slug].astro
│       ├── vehicles/index.astro
│       ├── drivers/index.astro
│       ├── drivers/[slug].astro
│       ├── testimonials.astro
│       ├── faq.astro
│       ├── about.astro
│       ├── contact.astro
│       └── en/…                         # English mirror of the above
├── tests/                     # Vitest (i18n/pricing utils) + Playwright (page render, lang switch)
├── public/                    # favicon, robots.txt, static assets
└── docs/design/architecture.md (this file)
```

---

## 9. Hosting & deployment

- **Build:** `astro build` → static `dist/`.
- **Host candidates:** Cloudflare Pages (recommended — global + strong presence near China), Netlify, or Vercel. All: free tier, auto-HTTPS, git-push deploys, custom domain.
- **Domain:** `turtlecharter.com` (already the repo name / intended domain).
- **CI/CD:** push to `main` → auto build & deploy. Preview deploys on PRs.
- **Analytics (optional, privacy-friendly):** Cloudflare Web Analytics or Plausible — no cookie banner needed.

> **Open item:** confirm host (leaning Cloudflare Pages). Does not affect app architecture.

---

## 10. SEO & sharing

- Per-locale `<title>`/meta description; **`hreflang`** alternates linking zh ⇄ en.
- **Open Graph / Twitter cards** with route/driver imagery for good link previews.
- **`sitemap.xml`** (Astro sitemap integration) + `robots.txt`.
- Structured data (schema.org) for the business and routes (optional, phase 2).
- Semantic headings, descriptive alt text (bilingual).

---

## 11. Extensibility (future-proofing)

The architecture keeps these cheap to add later without a rewrite:

- **More content types** (e.g. blog, seasonal offers) → new content collections (testimonials & FAQ already included).
- **Booking/payment** → introduce a serverless function or a booking integration; static shell stays.
- **Git-based CMS UI** (Decap/Sveltia) → layer over the existing Markdown files if non-technical editing is needed (was Question 3 Option B).
- **More languages** → add a locale + JSON dictionary + content fields; routing already generalized.
- **CRM/lead routing** → swap the form service target or add a webhook.

---

## 12. Risks & open items

| Item | Notes | When to resolve |
|------|-------|-----------------|
| Form service choice | Formspree vs Web3Forms | Implementation |
| Host choice | Cloudflare Pages vs Netlify/Vercel | Before first deploy |
| China accessibility | Some hosts/services can be slow/blocked in mainland China; audience is *overseas* so lower priority, but verify WeChat QR + images load acceptably | Pre-launch QA |
| Real content | Need real driver photos/bios, vehicle photos, route pricing from the business owner | Content phase |
| Styling system | Tailwind vs scoped CSS | Implementation kickoff |
| English quality | Ensure human-quality English, not machine translation | Content phase |

---

## 13. Proposed OpenSpec change breakdown

Once this doc is approved, I'll drive OpenSpec. Rather than one giant change, I propose splitting into reviewable capabilities (each becomes an `openspec` change → spec):

1. **`site-foundation`** ← **first change (approved)** — Astro scaffold, i18n routing (zh default), base layout, header/footer, language switch, styling baseline, test harness (Vitest + Playwright).
2. **`content-model`** — content collections + zod schemas for drivers/vehicles/routes/testimonials/faq + i18n string dictionaries.
3. **`drivers-and-vehicles`** — drivers list/detail + vehicles list (with per-day rates) pages and cards.
4. **`routes-and-pricing`** — routes list/detail with itineraries and per-vehicle pricing (package + per-day modes).
5. **`contact-inquiry`** — contact page, inquiry form + serverless submission, email + WeChat, sticky mobile CTA, route prefill.
6. **`testimonials-and-faq`** — testimonials page/cards + FAQ accordion.
7. **`home-and-about`** — homepage (hero, highlights, featured content) + about page + trust signals.
8. **`seo-and-deploy`** — sitemap, hreflang, OG tags, analytics, hosting/CI config.

> **Approved plan:** begin with #1 (`site-foundation`) as the first OpenSpec proposal (proposal → specs → design → tasks), then iterate through the rest.

---

## 14. Implementation methodology — TDD (superpowers)

Implementation of each OpenSpec change (via `/opsx:apply`) follows the **superpowers Test-Driven Development** discipline: **RED → GREEN → REFACTOR**, write the failing test first, minimum code to pass, then clean up.

What "test-first" means for a static Astro content site:
- **Unit (Vitest):** i18n utilities (locale ↔ path mapping, language-switch URL, fallback logic), pricing helpers (format CNY, resolve `pricing_mode` labels package vs per-day), content-schema validation.
- **Component/render (Vitest + Astro container / Playwright):** cards and layout render expected bilingual fields; language switch preserves the current path; `<html lang>` and `hreflang` are correct.
- **Build-level guardrails:** `astro build` succeeds; content collections pass zod validation (a failing content file breaks the build = a test).
- **E2E smoke (Playwright):** key pages load in both locales, nav works, inquiry form renders and validates.

Each change's `tasks.md` will encode this order (write test → see it fail → implement → see it pass) so the work is verifiable at every step.

---

## 15. Review checklist (for you)

- [x] Business/value-prop framing correct (一站式纯玩包车, overseas focus)
- [x] Sitemap — **FAQ + testimonials added**
- [x] Content model for drivers / vehicles / routes / testimonials / faq
- [x] Pricing model — **both per-route package and per-day** supported
- [x] Contact channels — **email + WeChat only** (WhatsApp dropped)
- [x] OpenSpec breakdown — **start at `site-foundation`**, workflow proposal → specs → design → tasks, implement with superpowers TDD

Open items remaining (do not block starting; resolved during implementation): form service (Formspree vs Web3Forms), host (leaning Cloudflare Pages), and real content from the business owner.

**Resolved during `site-foundation` implementation:** styling system → **scoped CSS + global design tokens** (no Tailwind); language switch and mobile menu ship **zero client JS** (pure computed links + CSS checkbox toggle).
