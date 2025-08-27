---
name: Bundling & Performance Optimization
about: Improve application load times, bundle size, and overall performance
title: 'feat: [perf] optimize bundling and assets'
labels: ['performance', 'optimization', 'assets']
assignees: ''
---

## Goal
Ensure fast loading, smooth user experience, and efficient delivery of assets.

## How-to

### Asset Loading & Security
- **No slow-loading random references:** No runtime pulls from mystery CDNs; every asset/script/style is vetted and fast.
  - **Search & kill remote includes:** Find `http(s)://` in codebase (tsx/jsx/html/css). Replace `<link href="https://…/lib.css">` and `<script src="https://…/lib.js">` with local, bundled equivalents.
  - **If a CDN is truly required:** Use **pinned versions** and **SRI** attributes. Prefer first-party CDNs (e.g., jsDelivr, unpkg) over random domains.
- **Fonts:** Self-host (`.woff2`), preconnect to your domain only, and set `font-display: swap`.
- **Images & SVGs:** Import via bundler; avoid runtime fetch from unknown origins.

### Core Stack & Libraries
- **Prefer official or lightweight React/CSS libs:** Keep core stack lean: React 18 + a mainstream UI system, tree-shaken.
  - **React + TS:** ensure React 18.x, `@types/react` aligned, strict TS mode on.
  - **UI layer (pick one, make it consistent):**
    - **Material UI v5**: use `@mui/material` + emotion; remove other styling libs to avoid conflicts.
    - or a lighter stack: `@radix-ui` primitives + minimal CSS modules.
  - **Utility libs:** import only what you use: `import { debounce } from 'lodash-es'` (or `'lodash/debounce'`).
  - **Date/Intl:** `date-fns` + native `Intl`, avoid heavy moment/timezone bundles.
  - **Icons:** tree-shakable sets (e.g., `lucide-react`) rather than sprite packs.

### Bundling & Build Process
- **Ensure assets/CSS are bundled correctly:** First paint is not blocked by network trips to third parties; CSS/JS are bundled, split, and cached.
  - **Bundler config (Vite/Next/webpack)**
    - **Code splitting:** dynamic `import()` for routes/heavy views.
    - **Tree shaking:** ensure `module`/`sideEffects` fields respected.
    - **CSS handling:** import styles in components or via an app entry; extract CSS to file (Vite/Next handle this).
    - **Purge/trim CSS:** remove unused CSS (Tailwind? enable `content` purge; MUI? prefer sx/inline or CSS modules).
  - **Critical resources:**
    - Preload key fonts/images:
      ```html
      <link rel="preload" as="font" href="/fonts/inter-var.woff2" type="font/woff2" crossorigin>
      ```
    - Defer non-critical scripts: `async`/`defer`.
  - **Images:**
    - Use modern formats (AVIF/WebP).
    - Set explicit width/height to avoid layout shift.
    - Inlining tiny SVGs; lazy-load below-the-fold.
  - **Environment-specific builds:** Ensure `NODE_ENV=production` for prod builds (enables React prod mode).
  - **Analyze bundle:**
    ```bash
    ANALYZE=true npm run build
    # or
    npx vite-bundle-visualizer
    # or for webpack:
    npx webpack-bundle-analyzer dist/stats.json
    ```

## Done when

- [ ] Grepping for external URLs finds only approved analytics/observability (and they’re async/deferred).
- [ ] Lighthouse shows no render-blocking third-party CSS/JS.
- [ ] Bundle analyzer shows no whole-library pulls (e.g., full lodash/moment).
- [ ] Only one consistent UI/styling solution remains.
- [ ] CSS/JS are produced by the bundler, with sensible chunks.
- [ ] CLS/LCP improve in Lighthouse; bundle analyzer shows trimmed vendors.
- [ ] All fonts are self-hosted `.woff2` with `font-display: swap`.
- [ ] All images use modern formats (AVIF/WebP) and explicit dimensions.
- [ ] `NODE_ENV=production` is confirmed for production builds.
- [ ] CI/CD includes performance audits (e.g., Lighthouse CI).
