# monis.rent Workspace Configurator

> An interactive, visual workspace equipment rental configurator designed to make workspace rental fast, exciting, and engaging for digital nomads and startups in Bali.

## Overview

**monis.rent Workspace Configurator** is a modern, interactive web application that helps users design and customize their rental workspace in real-time. Instead of browsing through boring product catalogs, users enjoy a visual, intuitive experience where they can select furniture, accessories, see a live preview, and review their rental estimate—all in one seamless flow.

This is a single-page application built with **Next.js 16**, **TypeScript**, and **Tailwind CSS**, designed for rapid deployment on Vercel with zero backend dependencies.

## Live Demo URL

Placeholder: `https://your-vercel-url.vercel.app`

## GitHub Repository

Placeholder: `https://github.com/your-username/monis-rent-workspace-configurator`

⚠️ **Important:** Add `desent-bot` as a GitHub collaborator before submitting the repository.

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 4
- **Icons:** Lucide React
- **Testing:** Jest + TypeScript
- **State Management:** React local state (Context-ready)
- **Deployment:** Vercel (serverless)
- **Linting:** ESLint 9

## Features

- ✅ **Realistic Product Visuals** - High-quality product images for all desks, chairs, and accessories
- ✅ **Visual Workspace Preview** - See your workspace setup update in real-time with actual product images
- ✅ **Multiple Desk Options** - Choose from 3 carefully curated desk styles (Compact, Popular, Premium)
- ✅ **Multiple Chair Options** - Select from 3 ergonomic and aesthetic chair choices
- ✅ **Accessory Add-ons** - Customize with 6 accessories (monitors, lamps, plants, coffee machine, shelves, planning board)
- ✅ **Quantity Control** - Adjust quantities for adjustable accessories like monitors
- ✅ **Rental Duration Options** - Choose 1, 2, 3, or 6 month rentals
- ✅ **Price Calculations** - Automatic monthly and total rental cost calculations
- ✅ **Responsive Design** - Beautiful on desktop and mobile devices
- ✅ **Checkout Summary** - Clear summary view before submitting rental request
- ✅ **Comprehensive Tests** - 45+ tests covering all business logic
- ✅ **CI/CD Ready** - GitHub Actions workflow for automated testing and builds

## Demo Flow

Here's how users interact with the application:

### 1. **Open the App**
   - User lands on the configurator home screen
   - Sees visual introduction to the service

### 2. **Choose Workspace Setup**
   - **Option A:** Select a preset workspace (if available) for quick setup
   - **Option B:** Manually choose:
     - A desk from 3 options (Compact Focus, Bamboo Standing, Founder Studio)
     - A chair from 3 options (Rattan Lounge, Ergo Cloud, Task Pro)

### 3. **Add Accessories**
   - Browse and add accessories (monitors, lamp, plant, coffee machine, shelf, planning board)
   - Adjust quantities for items like dual monitors
   - Remove items as needed

### 4. **Watch Preview Update**
   - Workspace preview updates instantly with selections
   - See visual representation of desk, chair, and accessories
   - Visual feedback for every interaction

### 5. **Choose Rental Duration**
   - Select rental period: 1, 2, 3, 6 months, or Flexible
   - See total rental cost update automatically
   - Best value badge appears for 3+ month rentals

### 6. **Review Checkout Summary**
   - Clear breakdown of selected items and prices
   - Monthly total calculation
   - Total rental estimate based on duration
   - Ready to proceed to checkout

### 7. **Submit Rental Request**
   - Click submit to proceed with rental application
   - Information prepared for backend processing

## Design Decisions

### 1. **Real-time Visual Feedback**
- Every selection immediately updates the preview
- Users see the impact of their choices instantly
- Reduces cognitive load and builds confidence

### 2. **Modular Component Architecture**
- `ConfiguratorShell` - Main layout and state management
- `ProductSelection` - Desk, chair, accessory selection UI
- `WorkspacePreview` - Visual representation of configured workspace
- `SummaryCheckout` - Order review and submission

### 3. **Type-Safe Business Logic**
- Pricing calculations isolated in `lib/pricing.ts`
- Product data organized in `data/products.ts`
- TypeScript ensures correctness at compile time

### 4. **Performance Optimizations**
- Minimal bundle size (only essential dependencies)
- Fast builds with Next.js 16
- Static generation where possible
- Tailwind CSS purges unused styles

### 5. **Testing First Approach**
- 45+ comprehensive tests for business logic
- Jest configured for Next.js
- GitHub Actions CI/CD for quality gates

## Product Thinking

### Problem We're Solving

Digital nomads and startups in Bali want to rent workspace equipment, but the process is typically:
- Boring catalog browsing
- Difficult to visualize the final setup
- No immediate feedback on pricing
- Frustrating and time-consuming

### Our Solution

We transformed workspace rental into a **visual, interactive experience** that:

1. **Reduces Cognitive Load** - Users don't overwhelm with choices; they explore through visual interaction
2. **Makes It Exciting** - Seeing a workspace come together visually is engaging and fun
3. **Fast Decision Making** - Real-time pricing and instant visual feedback accelerate the decision
4. **Builds Confidence** - Users see exactly what they're getting before committing
5. **Increases Conversion** - Engaging UX leads to more completed rental requests

### Target Users

- 🌴 Digital nomads seeking flexible workspace rentals
- 💼 Freelancers and solopreneurs setting up their first office
- 🚀 Startups needing affordable, flexible equipment rental
- 👥 Remote teams looking to establish collaboration spaces

## Local Development

### Prerequisites

- Node.js 18+ (recommended: 20.x LTS)
- npm or yarn

### Setup & Run

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd monis-rent-workspace-configurator
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open in browser:**
   ```
   http://localhost:3000
   ```

### Development Scripts

| Script | Purpose |
|--------|---------|
| `npm run dev` | Start development server with hot reload |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint code quality checks |
| `npm run test` | Run test suite once |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Generate test coverage report |

## Build Command

Production build for deployment:

```bash
npm run build
```

This generates an optimized, production-ready build in the `.next` directory.

## Testing

Tests verify all critical business logic:

```bash
npm run test
```

### Test Coverage

- **45+ unit tests** across 2 test suites
- **Pricing functions** - Monthly calculations, rental estimates, duration handling
- **Product data** - Lookups, validation, metadata consistency
- **Accessory management** - Adding, removing, quantity adjustments
- **Edge cases** - Invalid IDs, null values, boundary conditions

### Test Files

- `src/lib/pricing.test.ts` - Pricing logic and calculations
- `src/data/products.test.ts` - Product data and lookup functions

## Code Quality

Optional linting check:

```bash
npm run lint
```

## Deployment Notes

### Vercel Deployment (Recommended)

1. **Push to GitHub:**
   ```bash
   git push origin main
   ```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Vercel auto-detects Next.js configuration

3. **Configure (if needed):**
   - **Build Command:** `npm run build` (auto-detected)
   - **Output Directory:** `.next` (auto-detected)
   - **Install Command:** `npm install` (auto-detected)
   - **Environment Variables:** None required

4. **Deploy:**
   - Click "Deploy"
   - Vercel automatically builds and deploys on every push to main

### No Additional Setup Required

- ✅ No database needed
- ✅ No backend API required
- ✅ No environment variables
- ✅ No serverless functions
- ✅ Static/hybrid rendering compatible

### CI/CD Pipeline

GitHub Actions automatically runs on every push and pull request:

```yaml
✓ npm install --legacy-peer-deps
✓ npm run lint
✓ npm run test
✓ npm run build
```

## Future Improvements

### Phase 2 Features

- [ ] **Preset Workspace Bundles** - Pre-configured setups (e.g., "Startup Bundle", "Creator Bundle")
- [ ] **Wishlist** - Save configurations for later
- [ ] **Share Configurations** - Generate shareable links for workspace setups
- [ ] **Comparison Mode** - Compare 2-3 different configurations side-by-side
- [ ] **Augmented Reality (AR) Preview** - Visualize workspace in real space using device camera
- [ ] **Backend Integration** - Connect to rental backend for order submission

### Technical Debt & Optimization

- [ ] **State Management** - Migrate to Context API or Zustand for scalability
- [ ] **Component Library** - Extract reusable UI components
- [ ] **Performance** - Add image optimization and lazy loading
- [ ] **Analytics** - Track user behavior and conversion funnel
- [ ] **Internationalization** - Support multiple languages (Indonesian, English)

## Submission Checklist

Before submitting this project, ensure:

- ⚠️ **Critical:** Add `desent-bot` as a GitHub collaborator
- ✅ Code is pushed to GitHub (default branch: `main` or `master`)
- ✅ Repository is public and accessible
- ✅ `README.md` is complete with all documentation
- ✅ `npm run build` completes without errors
- ✅ `npm run test` passes all tests (45+ tests)
- ✅ Application is deployable to Vercel
- ✅ All ESLint issues resolved (`npm run lint`)
- ✅ TypeScript compilation successful (no `any` types without justification)
- ✅ Feature checklist complete (desks, chairs, accessories, preview, summary)

## Project Structure

```
monis-rent-workspace-configurator/
├── public/
│   └── products/
│       ├── desks/                    # Desk product images
│       │   ├── bamboo-standing-desk.svg
│       │   ├── compact-focus-desk.svg
│       │   └── founder-studio-desk.svg
│       ├── chairs/                   # Chair product images
│       │   ├── ergo-cloud-chair.svg
│       │   ├── rattan-lounge-chair.svg
│       │   └── task-pro-chair.svg
│       └── accessories/              # Accessory product images
│           ├── creator-monitor.svg
│           ├── sunset-task-lamp.svg
│           ├── tropical-plant.svg
│           ├── coffee-machine.svg
│           ├── open-shelf.svg
│           └── planning-board.svg
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Home page
│   │   └── globals.css         # Global styles
│   ├── components/
│   │   ├── configurator-shell.tsx    # Main component
│   │   ├── product-selection.tsx     # Selection UI with product images
│   │   ├── workspace-preview.tsx     # Preview component with product images
│   │   └── summary-checkout.tsx      # Summary component
│   ├── data/
│   │   ├── products.ts         # Product catalog with image paths
│   │   └── products.test.ts    # Product tests
│   ├── lib/
│   │   ├── pricing.ts          # Pricing logic
│   │   └── pricing.test.ts     # Pricing tests
│   └── public/                 # Static assets
├── jest.config.ts              # Jest configuration
├── next.config.ts              # Next.js configuration
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript configuration
└── README.md                   # This file
```

## Product Images

The application uses high-quality product images instead of generic icons for a more realistic and engaging experience:

### Asset Structure
- **Desks:** 3 desk designs (Bamboo Standing, Compact Focus, Founder Studio)
- **Chairs:** 3 chair designs (Ergo Cloud, Rattan Lounge, Task Pro)
- **Accessories:** 6 accessories (Monitor, Lamp, Plant, Coffee Machine, Shelf, Planning Board)

### Image Format
- **Format:** SVG (scalable vector graphics)
- **Location:** `/public/products/{category}/{product-id}.svg`
- **Optimization:** SVG files are lightweight and scale perfectly on any device
- **Replace:** To use real product photos, simply replace the SVG files with high-quality PNG/JPG images

### How Images Are Used
1. **Product Selection Cards** - Full product images displayed in desk/chair/accessory selection panels
2. **Workspace Preview** - Product images integrated into the visual workspace representation
3. **Responsive Design** - Images automatically scale for mobile and desktop views

---

**Created for Desent Coding Challenge** | Built with ❤️ for digital nomads and startups in Bali

Recommended Vercel settings:

- Framework preset: `Next.js`
- Build command: `npm run build`
- Output directory: leave as Vercel default
- Install command: `npm install`
- Environment variables: none

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
