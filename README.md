# laurinwerner.com

Source of the portfolio site of Laurin Werner, frontend developer in Düsseldorf.

> Work in progress — the site is being rebuilt. A full README with architecture
> notes and Lighthouse scores follows once the site is live.

## Development

Requires Node (see `.nvmrc`) and pnpm (see `packageManager` in `package.json`).

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

Checks: `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm test:e2e`, `pnpm build`.
