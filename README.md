# tanzania-tourism-frontend

Open-source SvelteKit website for Tanzanian tour operators and travel agencies: fast, SEO-friendly Kilimanjaro, safari, Zanzibar and Tanzania tour pages. Pairs with [tanzania-tourism-cms](../tanzania-tourism-cms) (Strapi v5).

**Stack:** SvelteKit + Svelte 5 (runes, SSR), TypeScript, Tailwind v4, shadcn-svelte, Leaflet (lazy-loaded), Vercel image optimization, Vitest.

## Pages

Home, `/tours` (filter by category/destination, search), `/tours/[slug]` (itinerary, inclusions, gallery lightbox, FAQ, enquiry form), `/destinations`, `/destinations/[slug]`, `/about`, `/contact`, `/sitemap.xml`, `/robots.txt`. JSON-LD: `TouristTrip` on tours, `Place` on destinations, `Organization` site-wide.

## Quick start

Requires **Node 22.17+** (`nvm use`, see `.nvmrc`) and pnpm.

```bash
cp .env.example .env     # PUBLIC_API_URL=http://localhost:1337
pnpm install
pnpm dev
```

Start the CMS first (`npm run develop` and `npm run seed` in the CMS repo).

| Command                     | What it does                      |
| --------------------------- | --------------------------------- |
| `pnpm dev`                  | Dev server                        |
| `pnpm build`                | Production build (Vercel adapter) |
| `pnpm check`                | Type check                        |
| `pnpm lint` / `pnpm format` | ESLint + Prettier                 |
| `pnpm test`                 | Unit tests (Vitest)               |

## Configuration

- `PUBLIC_API_URL`: Strapi base URL. Public endpoints only, no token needed.
- API responses are cached in memory on the server (60 s lists, 5 min site settings).
- Enquiries: the form posts to `/enquiry`, which validates and forwards to Strapi. A hidden `website` honeypot silently drops bots; the CMS also rate-limits.

## Images

Strapi images are remote, so they are served through Vercel image optimization (`/_vercel/image`, configured under `images` in `vite.config.ts`) by the `<Img>` component (srcset, lazy loading). Set the allowed `remotePatterns` there to your CMS host before deploying. In dev the original URL is used.

Upload web-sized images in the CMS (about 2000 px wide, JPEG/WebP, under 500 KB); never upload 5-10 MB originals.

The seed data has no photos, so pages show a placeholder. **Replace with your own photos** in the Strapi admin (cover image and gallery on tours and destinations).

## Deploy (Vercel)

Import the repo, set `PUBLIC_API_URL`, set the Node version to 22.x, update `remotePatterns`, deploy.

## Known limits

- Destinations have no latitude/longitude in the CMS, so the map (`Map.svelte`) is not shown yet. Add the fields to the destination type and pass them to `<Map>`.
- `$lib` is enabled through the deprecated SvelteKit `alias` option (SvelteKit 3), which shadcn-svelte still expects.

## Need the Pro version or a custom build?

Contact: clevengodsontech@gmail.com

## License

See [LICENSE](LICENSE).
