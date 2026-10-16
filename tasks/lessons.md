# Lessons

- **Check what Laurin actually sees.** A long-running `pnpm dev` (Turbopack) can keep
  serving stale CSS after `@utility` renames in `globals.css`. Before judging a
  design report, compare the dev server's CSS with a fresh production build, and
  ask for a dev-server restart when they differ.
- **Display titles must fit their box at every width.** Size them in `cqi` against
  the longest real title and assert "one line" in a measurement, not by eye.
- **Never position elements from the scroll position frame by frame.** The
  browser scrolls on the compositor thread; script reacting to scroll events is a
  frame behind, so "glued" elements jitter. Trigger time-based animations instead
  (IntersectionObserver + FLIP) and let moving elements land somewhere stable.
- **Verify motion per frame, not by screenshots at rest.** A rAF probe logging
  positions while wheel-scrolling (Chromium and Firefox) shows jitter as values
  jumping back and forth; frames extracted from a Playwright video show it too.
- **Observe the mask, animate its content.** IntersectionObserver counts clipping
  by ancestors: an element hidden below a clip-path never "intersects", so a
  reveal that observes it never fires. Observe the clipping box instead.
- **Drop CSS pre-hide styles before GSAP reads them.** GSAP parses the current
  computed transform as its starting point; a CSS `translateY(100%)` still active
  at `gsap.set` time becomes a permanent extra offset.
- **Screenshot animations mid-flight, not only at rest.** Both bugs above passed
  every test until a frame-by-frame capture showed the heading never appearing.
