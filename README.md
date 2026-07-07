# Your Bike Website

White-label **Your Bike Website** template for Dutch bike refurbishing and repair shops. Fork this repo, customize your branding, and deploy to Vercel.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — the site supports Dutch (`/nl`) and English (`/en`).

## Customize your brand

### 1. Business details

Edit [`src/site.config.ts`](src/site.config.ts):

- `SITE_NAME` — your shop name (shown in header, footer, metadata)
- `SITE_URL` — your live domain (or Vercel URL)
- `NAP` — address, phone, email, KvK, BTW, opening hours, social links
- `MAP_QUERY` — address string for the embedded Google Map

### 2. Logo

Replace [`public/img/brand/bike-mark.svg`](public/img/brand/bike-mark.svg) with your own mark (SVG recommended). The wordmark is driven by `SITE_NAME` in `site.config.ts`.

### 3. Copy and translations

Update [`src/messages/nl.json`](src/messages/nl.json) and [`src/messages/en.json`](src/messages/en.json) for page titles, hero text, legal pages, and WhatsApp intro messages.

### 4. Color theme

The default theme is **steel blue + orange** in [`packages/tokens/src/themes/bike-steel.css`](packages/tokens/src/themes/bike-steel.css). Adjust the CSS variables (`--color-primary`, `--color-accent`, etc.) to match your brand.

Display font is **DM Sans** (configured in [`src/app/[locale]/layout.tsx`](src/app/[locale]/layout.tsx)).

## Deploy to Vercel

1. Push this repo to GitHub (or fork it).
2. Import the repository in [Vercel](https://vercel.com/new).
3. **Root Directory:** leave as **`.`** (repository root) — **do not** select `packages/ui` (that folder is only a shared component library, not the website).
4. **Framework Preset:** **Next.js** (auto-detected when root is correct).
5. Copy variables from [`.env.example`](.env.example) into Vercel → Settings → Environment Variables.
6. Deploy.

> **Already deployed:** [templated-bike-website.vercel.app](https://templated-bike-website.vercel.app) — if you created a second project with Root Directory `packages/ui`, delete it or change Root Directory to `.` under Project Settings → General.

Optional: add a custom domain in Vercel and set `NEXT_PUBLIC_SITE_URL` to match.

## Optional integrations

All integrations are env-driven and safe to leave unset — the site falls back gracefully.

| Integration | Env vars | What it enables |
|-------------|----------|-----------------|
| Google reviews | `Places_API`, `NEXT_PUBLIC_GOOGLE_PLACE_ID` | Live review block + rating snippet |
| CycleSoftware inventory | `CYCLESOFTWARE_API_USER`, `CYCLESOFTWARE_API_PASSWORD` | Live refurbished bike listings |
| Instagram feed | `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_USER_ID` | Homepage Instagram grid |
| Analytics | `NEXT_PUBLIC_GA_ID` | Google Analytics 4 |
| Inventory cron | `CRON_SECRET` | Daily sync at `/api/cron/sync-inventory` |

## Fork workflow (for shop owners)

1. **Fork** this repository on GitHub.
2. **Clone** your fork locally.
3. **Customize** `site.config.ts`, logo, messages, and theme colors.
4. **Connect** your fork to a new Vercel project.
5. **Set** environment variables when you have API keys (Google, CycleSoftware, Instagram).
6. **Point** your domain at Vercel when ready to go live.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Serve production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run test` | Vitest (CycleSoftware mapper) |

## Project structure

```
├── src/                 # Next.js app (pages, components, content)
├── public/              # Static assets (logo, placeholders)
├── packages/
│   ├── config/          # Shared Tailwind + TypeScript config
│   ├── tokens/          # CSS design tokens + bike-steel theme
│   └── ui/              # Shared React components
└── vercel.json          # Cron schedule for inventory sync
```

## License

Private template — customize and deploy for your own business.
