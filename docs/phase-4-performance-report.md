# Phase 4 — Performance optimization report

## Outcome

The application now avoids continuous background work, avoids global React re-renders during scroll and pointer movement, statically revalidates its public roadmap catalog, and has database indexes aligned to production read paths.

## Optimizations implemented

### Client runtime

- Reworked `AppEffects` to use Framer Motion values for scroll progress and pointer glow. Scroll no longer updates React state on every browser event.
- Batched pointer coordinates to one `requestAnimationFrame` update and enabled the pointer listener only on fine-pointer devices. This avoids unnecessary mobile work.
- Preserved reduced-motion behavior: the pointer glow does not subscribe to pointer events when reduced motion is enabled.
- Changed `AnimatedGrid` from an always-running animation loop to a one-time paint plus a request-animation-frame-batched resize paint. The grid is visually identical but no longer consumes a frame every frame.

### Rendering and caching

- Made the roadmap catalog use an hourly ISR revalidation interval (`revalidate = 3600`). Public roadmap content can now be served from Next’s cache instead of being dynamically rendered per request.
- Moved the public roadmap catalog query to the server-only administrative client so it does not read request cookies and inadvertently force dynamic rendering. Only published fields are queried.
- Kept authenticated and personalized data dynamic, preventing user-specific dashboard, progress, community, and profile data from being cached across users.

### Database and API query paths

- Narrowed roadmap-progress queries to level IDs from the selected roadmap rather than reading every completed level for the current user.
- Added migration `0006_query_performance.sql` with indexes for:
  - published roadmap ordering;
  - user project/status/portfolio queries;
  - circle membership lookups;
  - active challenge windows;
  - published job ordering;
  - certificate history; and
  - job application lookups.

### Existing optimizations retained

- `lucide-react` package imports are already optimized in Next configuration.
- The application uses system fonts, so it has no external font request or font-display delay.
- No raster images are currently shipped by the application; therefore image conversion and responsive image work are not applicable yet.
- Route loading skeletons, code-separated route modules, and `prefers-reduced-motion` support remain enabled.

## Verification

- `tsc --noEmit`: passed.
- `eslint .`: passed.
- `next build`: compilation began but the desktop sandbox blocks Turbopack from creating an internal process/port while processing CSS (`Operation not permitted`). This is an environment restriction previously observed in Phase 2, not a TypeScript or ESLint failure.

## Remaining deployment measurement

Run the production build and Lighthouse against a deployed preview (or an unrestricted local environment) to establish the final numeric score. The target of 95+ cannot be truthfully claimed until that measurement is available.
