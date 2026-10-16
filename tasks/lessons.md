# Lessons

- **Check what Laurin actually sees.** Turbopack's dev server (and its disk cache
  in `.next/dev`, which survives restarts) has twice kept serving an old
  `globals.css` while component classes updated. A restart alone does not fix
  it. When a design report contradicts the code, grep the dev server's CSS for
  the change; if it is missing but the production build has it, the fix is:
  stop `pnpm dev`, `rm -rf .next/dev`, start again.
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
