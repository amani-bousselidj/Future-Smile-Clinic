# Hero Section — Advanced Layered Implementation

This component implements a 4-layer dental clinic hero with parallax, blend effects, and progressive image loading.

Files added:
- `src/components/HeroTooth.tsx` — React client component that composes the four layers and implements parallax + IntersectionObserver.
- `src/components/HeroTooth.module.css` — Mobile-first CSS module with blend modes and responsive typography.

Key features:
- Layered z-index structure: background (1), text behind tooth (2), tooth image (3), foreground/nav (4).
- Parallax implemented with `requestAnimationFrame` adjusting transforms of background and tooth.
- Reveal animations via `IntersectionObserver` toggling `.inView` on the big text element.
- Image performance: `picture` with WebP `source` and PNG fallbacks, `loading` attributes, `decoding`, and `fetchpriority` for LCP background.
- Mobile-first CSS with breakpoints and `prefers-reduced-motion` support.

Performance recommendations to hit Lighthouse targets:
- Ensure `background.webp` and `tooth.webp` are optimized (use`cwebp` or `squoosh`).
- Serve images with correct `Cache-Control` headers and use a CDN.
- Preload the background image in the page `<Head>` for LCP using:
  ```html
  <link rel="preload" as="image" href="/images/background.webp" type="image/webp">
  ```
- Keep the hero HTML minimal and avoid large render-blocking scripts.

How to test locally:
1. Run `npm run build` then `npm start` or `next build && next start`.
2. Open Lighthouse in Chrome DevTools (mobile emulation) and check LCP/CLS.

Notes:
- If you want the big text to be perfectly masked by the tooth shape, provide an SVG mask path for the tooth and the component can be adjusted to use `<svg><mask>` approach.
- The current implementation aims for clarity, accessibility, and progressive enhancement.
