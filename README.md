# monis.rent Workspace Configurator

Interactive workspace equipment rental configurator for `monis.rent`, focused on helping Bali digital nomads, freelancers, and startups visually design a workspace before submitting a rental request.

## Public URL

Placeholder: `https://your-vercel-url.vercel.app`

## GitHub Repository

Placeholder: `https://github.com/your-username/monis-rent-workspace-configurator`

Important: add `desent-bot` as a GitHub collaborator before submitting the repository.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Lucide React icons
- Local React state
- Vercel deployment target

## Features Checklist

- [x] User can select a desk from at least 2 options
- [x] User can select a chair from at least 2 options
- [x] User can add accessories
- [x] Workspace preview updates visually
- [x] Summary/checkout view exists
- [x] App is deployable to Vercel
- [x] Code is ready for GitHub submission

## How to Run Locally

```bash
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

## How to Build

```bash
npm run build
```

Optional lint check:

```bash
npm run lint
```

## How to Deploy to Vercel

1. Push this project to GitHub.
2. Import the repository in Vercel.
3. Use the default Next.js framework settings.
4. No environment variables are required.
5. Deploy.

## Design Decisions

- The UI is built as a visual workspace builder instead of a plain product catalog, so users feel like they are designing a setup rather than shopping from a list.
- Product data is mocked in TypeScript for desks, chairs, and accessories, keeping the challenge focused on frontend experience.
- State is handled locally with React state because there is no backend or persistence requirement yet.
- The visual direction is optimized for digital nomads and startups in Bali: premium, clean, hospitality-inspired, and practical.

## Project Structure

- `src/app/page.tsx` renders the main app route.
- `src/components/configurator-shell.tsx` owns the configurator state and page flow.
- `src/components/product-selection.tsx` renders desk, chair, and accessory selection.
- `src/components/workspace-preview.tsx` renders the interactive visual workspace scene.
- `src/components/summary-checkout.tsx` renders the rental summary, request form, and success state.
- `src/data/products.ts` contains typed mock product data and pricing helpers.
