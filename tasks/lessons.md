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
- **Hold the line on motion budget.** The homepage has two linked movements
  (name flight, project → case study morph). A third (scroll-spy underline in
  the navigation) was built and dropped as distracting. When an effect is
  already judged "too much", recommend no motion rather than a lighter variant.
- **Generated image routes under `[locale]` are their own route handlers.**
  They inherit no params from the page (list them in `generateStaticParams`),
  Next calls `generateImageMetadata` with empty params at build time, next-intl
  must get the locale explicitly (no root params in route handlers), and the
  i18n proxy must not touch them (it redirected `/de/…` and rewrote `/icon/32`
  to a 404). Fetch every generated URL once before calling it done.
