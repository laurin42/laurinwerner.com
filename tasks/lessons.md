# Lessons

- **Check what Laurin actually sees.** A long-running `pnpm dev` (Turbopack) can keep
  serving stale CSS after `@utility` renames in `globals.css`. Before judging a
  design report, compare the dev server's CSS with a fresh production build, and
  ask for a dev-server restart when they differ.
- **Display titles must fit their box at every width.** Size them in `cqi` against
  the longest real title and assert "one line" in a measurement, not by eye.
