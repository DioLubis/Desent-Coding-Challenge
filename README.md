# monis.rent workspace configurator

Interactive rental configurator foundation for workspace equipment in Bali.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Lucide React icons
- Vercel-ready static App Router page

## Local development

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Checks

```bash
npm run lint
npm run build
```

## Structure

- `src/app/page.tsx` renders the configurator page.
- `src/components/configurator-shell.tsx` owns the interactive selection state.
- `src/components/product-selection.tsx` renders the mock product picker.
- `src/components/workspace-preview.tsx` renders the visual workspace mockup.
- `src/components/summary-checkout.tsx` renders rental totals and the checkout placeholder.
- `src/data/products.ts` contains mock rental data and IDR formatting.

## Vercel

Deploy with the default Vercel Next.js preset. No environment variables or backend services are required for this foundation.
