"use client";

import type { ReactNode } from "react";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowDown,
  CalendarDays,
  Check,
  Copy,
  MapPin,
  PackageCheck,
  Sparkles,
  UsersRound,
  Wand2,
} from "lucide-react";
import { ProductSelection } from "@/components/product-selection";
import { SummaryCheckout } from "@/components/summary-checkout";
import { WorkspacePreview } from "@/components/workspace-preview";
import {
  defaultConfiguratorSelections,
  findProduct,
  formatCurrency,
  products,
  type CatalogProduct,
  type ConfiguratorState,
  type SelectedProduct,
} from "@/data/products";
import {
  calculateMonthlyTotal,
  calculateWeeklyTotal,
} from "@/lib/pricing";

const STORAGE_KEY = "monis-rent-selected-products";

const setupPresets: Array<{
  name: string;
  description: string;
  selectedProducts: SelectedProduct[];
}> = [
  {
    name: "Starter Monitor Kit",
    description: "A simple setup for focused work and smooth delivery planning.",
    selectedProducts: [
      { id: "monitor-a24i-2026", quantity: 1 },
      { id: "smart-power-strip-3", quantity: 1 },
    ],
  },
  {
    name: "Creative Studio Kit",
    description: "A premium display stack with practical support gear.",
    selectedProducts: [
      { id: "apple-studio-display", quantity: 1 },
      { id: "monitor-27-4k-multimedia", quantity: 1 },
    ],
  },
  {
    name: "Compact Office Kit",
    description: "A lighter bundle for a small room or temporary workspace.",
    selectedProducts: [
      { id: "monitor-a27i", quantity: 1 },
      { id: "monitor-a24i", quantity: 1 },
    ],
  },
];

function buildConfiguratorState(selectedProducts: SelectedProduct[]): ConfiguratorState {
  return {
    selectedProducts,
    totalWeeklyPrice: calculateWeeklyTotal(selectedProducts),
    totalMonthlyPrice: calculateMonthlyTotal(selectedProducts),
  };
}

function normalizeSelections(selectedProducts: SelectedProduct[]) {
  return selectedProducts
    .map((selectedProduct) => {
      const product = findProduct(selectedProduct.id);
      if (!product) return null;

      return {
        id: product.id,
        quantity: Math.max(1, selectedProduct.quantity || 1),
      };
    })
    .filter((item): item is SelectedProduct => item !== null);
}

function stateFromSearchParams(searchParams: URLSearchParams) {
  const encodedSelections = searchParams.get("products") ?? searchParams.get("accessories") ?? "";
  const selectedProducts = normalizeSelections(
    encodedSelections
      .split(",")
      .filter(Boolean)
      .map((entry) => {
        const [id, quantity = "1"] = entry.split(":");

        return { id, quantity: Number.parseInt(quantity, 10) || 1 };
      }),
  );

  return selectedProducts.length > 0 ? buildConfiguratorState(selectedProducts) : null;
}

function stateFromStorageValue(value: string | null) {
  if (!value) return null;

  try {
    const parsed = JSON.parse(value) as Partial<ConfiguratorState> & {
      selectedDesk?: string | null;
      selectedChair?: string | null;
      selectedAccessories?: SelectedProduct[];
    };

    const selectedProducts = normalizeSelections(
      Array.isArray(parsed.selectedProducts)
        ? parsed.selectedProducts
        : Array.isArray(parsed.selectedAccessories)
          ? parsed.selectedAccessories
          : [parsed.selectedDesk, parsed.selectedChair]
              .filter((item): item is string => typeof item === "string")
              .map((id) => ({ id, quantity: 1 })),
    );

    return selectedProducts.length > 0 ? buildConfiguratorState(selectedProducts) : null;
  } catch {
    return null;
  }
}

function setupSearchParams(state: ConfiguratorState) {
  const searchParams = new URLSearchParams();

  if (state.selectedProducts.length > 0) {
    searchParams.set(
      "products",
      state.selectedProducts.map((item) => `${item.id}:${item.quantity}`).join(","),
    );
  }

  return searchParams;
}

export function ConfiguratorShell() {
  const [configuratorState, setConfiguratorState] = useState<ConfiguratorState>(() =>
    buildConfiguratorState(defaultConfiguratorSelections.selectedProducts),
  );
  const [hasLoadedSavedSetup, setHasLoadedSavedSetup] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const sharedState = stateFromSearchParams(new URLSearchParams(window.location.search));
      const storedState = stateFromStorageValue(window.localStorage.getItem(STORAGE_KEY));
      const restoredState = sharedState ?? storedState;

      if (restoredState) setConfiguratorState(restoredState);
      setHasLoadedSavedSetup(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!hasLoadedSavedSetup) return;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ selectedProducts: configuratorState.selectedProducts }));
  }, [configuratorState, hasLoadedSavedSetup]);

  useEffect(() => {
    if (!toastMessage) return;

    const timeout = window.setTimeout(() => setToastMessage(""), 2200);

    return () => window.clearTimeout(timeout);
  }, [toastMessage]);

  const selectedProducts = useMemo(
    () =>
      configuratorState.selectedProducts
        .map((selectedProduct) => {
          const product = findProduct(selectedProduct.id);

          return product ? { product, quantity: selectedProduct.quantity } : null;
        })
        .filter((item): item is { product: CatalogProduct; quantity: number } => item !== null),
    [configuratorState.selectedProducts],
  );

  const toggleProduct = (id: string) => {
    setConfiguratorState((current) => {
      const isSelected = current.selectedProducts.some((item) => item.id === id);
      const selectedProducts = isSelected
        ? current.selectedProducts.filter((item) => item.id !== id)
        : [...current.selectedProducts, { id, quantity: 1 }];

      return buildConfiguratorState(selectedProducts);
    });
  };

  const applyPreset = (preset: (typeof setupPresets)[number]) => {
    setConfiguratorState(buildConfiguratorState(normalizeSelections(preset.selectedProducts)));
    document.getElementById("preview")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const copySetupLink = async () => {
    const searchParams = setupSearchParams(configuratorState);
    const setupUrl = `${window.location.origin}${window.location.pathname}${
      searchParams.size > 0 ? `?${searchParams.toString()}` : ""
    }`;

    try {
      await window.navigator.clipboard.writeText(setupUrl);
      setToastMessage("Setup link copied.");
    } catch {
      const textArea = document.createElement("textarea");
      textArea.value = setupUrl;
      textArea.setAttribute("readonly", "");
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand("copy");
      textArea.remove();
      setToastMessage("Setup link copied.");
    }
  };

  const selectedItemCount = configuratorState.selectedProducts.reduce(
    (total, selectedProduct) => total + selectedProduct.quantity,
    0,
  );

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f1e8] text-[#201b18]">
      <section className="relative isolate min-h-[92vh] px-4 py-5 sm:px-6 lg:px-8">
        <div
          className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(255,183,94,0.5),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(80,173,180,0.3),transparent_26%),linear-gradient(135deg,#fff7e9_0%,#f6ecdf_55%,#e6f2ef_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute bottom-0 left-0 right-0 -z-10 h-[46%] bg-[linear-gradient(160deg,#d89a52_0%,#f3bf6b_45%,#e5a359_100%)]"
          aria-hidden="true"
        />
        <div className="mx-auto flex min-h-[86vh] max-w-7xl flex-col">
          <nav className="flex items-center justify-between py-2" aria-label="Primary">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#b45f32]">
              monis.rent
            </p>
            <a
              href="#checkout"
              className="rounded-full bg-[#201b18] px-4 py-2 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#f06f61] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f1e8]"
            >
              Rent request
            </a>
          </nav>

          <div className="grid flex-1 items-center gap-8 py-8 sm:gap-10 sm:py-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1fr)]">
            <div className="relative z-10 max-w-3xl">
              <p className="mb-4 inline-flex rounded-full bg-white/65 px-4 py-2 text-sm font-black text-[#245b61] shadow-sm backdrop-blur">
                Workspace rentals for modern teams
              </p>
              <h1 className="text-4xl font-black leading-[0.94] tracking-tight text-[#1d1a16] sm:text-7xl lg:text-8xl">
                Design Your Product Stack
              </h1>
              <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-[#5f5148] sm:text-xl">
                Pick from the live Monis Electronics catalog, compare weekly and monthly prices, and share a request that keeps missing fields from breaking the page.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#configurator"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#f06f61] px-7 text-sm font-black text-white shadow-xl shadow-[#f06f61]/25 transition hover:-translate-y-0.5 hover:bg-[#df5f52] focus-visible:ring-2 focus-visible:ring-[#201b18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f1e8]"
                >
                  Start Building
                  <ArrowDown className="size-4" />
                </a>
                <span className="text-sm font-bold text-[#6c5e53]">
                  Weekly and monthly pricing pulled from JSON.
                </span>
              </div>
            </div>

            <div
              className="relative mx-auto min-h-85 w-full max-w-155 sm:min-h-105 lg:max-w-none"
              aria-hidden="true"
            >
              <div className="absolute left-1/2 top-20 h-8 w-[72%] -translate-x-1/2 rounded-full bg-[#8d5836] shadow-2xl" />
              <div className="absolute left-[18%] top-28 h-32 w-4 rounded-full bg-[#70422d]" />
              <div className="absolute right-[18%] top-28 h-32 w-4 rounded-full bg-[#70422d]" />
              <div className="absolute left-1/2 top-11 h-14 w-[78%] -translate-x-1/2 rounded-3xl bg-linear-to-r from-[#d79248] via-[#e7ad66] to-[#c87836] shadow-[0_30px_80px_rgba(77,45,24,0.28)] ring-4 ring-white/45" />
              <div className="absolute left-[36%] top-0 grid size-20 place-items-center rounded-3xl bg-linear-to-br from-[#6c6b7d] to-[#252431] text-white shadow-2xl ring-4 ring-white/55">
                <span className="h-8 w-11 rounded-md border-4 border-white/85" />
              </div>
              <div className="absolute right-[22%] top-7 grid size-16 place-items-center rounded-[1.4rem] bg-linear-to-br from-[#ffd36b] to-[#e1922f] text-white shadow-2xl ring-4 ring-white/55">
                <span className="h-8 w-4 rounded-full bg-white/80" />
              </div>
              <div className="absolute left-[18%] top-24 grid size-16 place-items-center rounded-[1.4rem] bg-linear-to-br from-[#86c987] to-[#367a4c] text-white shadow-2xl ring-4 ring-white/55">
                <span className="size-8 rounded-full bg-white/75" />
              </div>
              <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center">
                <div className="h-24 w-28 rounded-[2rem_2rem_1.4rem_1.4rem] bg-linear-to-br from-[#76b5bd] to-[#2c6d79] shadow-[0_22px_60px_rgba(32,27,24,0.24)] ring-4 ring-white/50 sm:h-28 sm:w-32" />
                <div className="-mt-4 h-16 w-24 rounded-3xl bg-linear-to-br from-[#76b5bd] to-[#2c6d79] shadow-lg" />
                <div className="h-12 w-3 bg-[#244f57]" />
                <div className="h-3 w-28 rounded-full bg-[#244f57]" />
              </div>
              <div className="absolute bottom-0 left-1/2 h-28 w-[82%] -translate-x-1/2 rounded-[50%] bg-[#6e4c37]/22 blur-sm" />
            </div>
          </div>
        </div>
      </section>

      <section id="configurator" className="px-4 py-12 sm:px-6 sm:py-14 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="Interactive configurator"
            title="Choose the products that match how you work."
            copy="The list now comes directly from the Monis Electronics JSON feed, so product names, images, descriptions, specs, and prices stay aligned with the source data."
          />
          <div className="mt-6 rounded-[1.75rem] border border-white/70 bg-white/65 p-4 shadow-[0_18px_70px_rgba(77,55,35,0.1)] backdrop-blur sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="inline-flex items-center gap-2 rounded-full bg-[#201b18] px-3 py-1.5 text-xs font-black uppercase tracking-[0.12em] text-[#f5b76b]">
                  <Wand2 className="size-3.5" />
                  Fast presets
                </p>
                <h3 className="mt-3 text-2xl font-black tracking-tight">Start from a proven setup.</h3>
              </div>
              <p className="max-w-md text-sm font-medium leading-6 text-[#6c5e53]">
                Use a preset as a shortcut, then fine-tune every item below.
              </p>
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {setupPresets.map((preset, index) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  aria-label={`Apply ${preset.name}`}
                  className="group rounded-[1.35rem] border border-[#eadfce] bg-white/82 p-4 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#d78f43] hover:shadow-xl focus-visible:ring-2 focus-visible:ring-[#f06f61] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f1e8]"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="grid size-10 place-items-center rounded-2xl bg-[#f6ecdf] text-sm font-black text-[#b45f32]">
                      0{index + 1}
                    </span>
                    {index === 0 ? (
                      <span className="rounded-full bg-[#e2f2ef] px-2.5 py-1 text-[10px] font-black uppercase text-[#245b61]">
                        Recommended
                      </span>
                    ) : null}
                  </span>
                  <span className="mt-4 block text-base font-black">{preset.name}</span>
                  <span className="mt-2 block text-sm leading-6 text-[#6c5e53]">
                    {preset.description}
                  </span>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#b45f32]">
                    Apply setup
                    <ArrowDown className="size-4 transition group-hover:translate-y-0.5" />
                  </span>
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-col gap-3 rounded-[1.25rem] bg-[#fff7e9] p-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm font-bold leading-6 text-[#6c5e53]">
                Your setup is saved on this device and can be shared as a link.
              </p>
              <button
                type="button"
                onClick={copySetupLink}
                aria-label="Copy selected product setup link"
                className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#201b18] px-4 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#3a302a] focus-visible:ring-2 focus-visible:ring-[#f06f61] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f1e8]"
              >
                <Copy className="size-4" />
                Copy Setup Link
              </button>
            </div>
          </div>
          <div className="mt-6">
            <ProductSelection
              state={configuratorState}
              products={products}
              selectedItemCount={selectedItemCount}
              onToggleProduct={toggleProduct}
            />
          </div>
        </div>
      </section>

      <section id="preview" className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="Workspace preview"
            title="Watch your product request come together."
            copy="The preview updates as you choose products, so the request feels designed before it is sent."
          />
          <div className="mt-6">
            <WorkspacePreview selectedProducts={selectedProducts} />
          </div>
        </div>
      </section>

      <section id="checkout" className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(360px,520px)] lg:items-start">
          <div className="rounded-4xl bg-white/60 p-5 shadow-[0_18px_70px_rgba(77,55,35,0.1)] backdrop-blur">
            <SectionIntro
              eyebrow="Rent request"
              title="Confirm the products, then send the request."
              copy="No complicated checkout. Share your contact, rental duration, and preferred delivery date so the Monis team can prepare the next step."
            />
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {[
                "Pick products",
                "Preview request",
                "Send inquiry",
              ].map((step, index) => (
                <div key={step} className="rounded-3xl bg-[#201b18] p-4 text-white shadow-lg shadow-[#201b18]/10">
                  <span className="grid size-8 place-items-center rounded-full bg-[#f5b76b] text-sm font-black text-[#201b18]">
                    {index + 1}
                  </span>
                  <p className="mt-4 text-sm font-black">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <SummaryCheckout
            state={configuratorState}
            selectedProducts={selectedProducts}
          />
        </div>
      </section>

      <section className="px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="Why rent"
            title="Built for temporary homes, focused sprints, and fast-moving teams."
            copy="A cleaner way to set up a productive workspace without buying, storing, or moving equipment."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <BenefitCard
              icon={<CalendarDays className="size-5" />}
              title="Flexible weekly or monthly pricing"
              copy="Compare the live scraped prices and keep the request transparent."
            />
            <BenefitCard
              icon={<MapPin className="size-5" />}
              title="Delivery in Bali"
              copy="Designed for villas, studios, coworking overflow, and temporary offices."
            />
            <BenefitCard
              icon={<UsersRound className="size-5" />}
              title="Ideal for nomads and startups"
              copy="Create a focused workspace for calls, launches, and daily deep work."
            />
            <BenefitCard
              icon={<PackageCheck className="size-5" />}
              title="No need to buy equipment"
              copy="Avoid one-off purchases, storage problems, and resale friction."
            />
          </div>
        </div>
      </section>

      <FloatingSummary
        selectedItemCount={selectedItemCount}
        totalMonthlyPrice={configuratorState.totalMonthlyPrice}
        totalWeeklyPrice={configuratorState.totalWeeklyPrice}
        onCopySetupLink={copySetupLink}
      />
      {toastMessage ? (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-5 left-1/2 z-60 -translate-x-1/2 rounded-full bg-[#201b18] px-5 py-3 text-sm font-black text-white shadow-2xl"
        >
          {toastMessage}
        </div>
      ) : null}
    </main>
  );
}

function SectionIntro({
  eyebrow,
  title,
  copy,
}: {
  eyebrow: string;
  title: string;
  copy: string;
}) {
  return (
    <div>
      <p className="text-sm font-black uppercase tracking-[0.18em] text-[#b45f32]">
        {eyebrow}
      </p>
      <h2 className="mt-2 max-w-3xl text-3xl font-black leading-tight tracking-tight text-[#1d1a16] sm:text-5xl">
        {title}
      </h2>
      <p className="mt-3 max-w-2xl text-base font-medium leading-7 text-[#6c5e53]">
        {copy}
      </p>
    </div>
  );
}

function FloatingSummary({
  selectedItemCount,
  totalMonthlyPrice,
  totalWeeklyPrice,
  onCopySetupLink,
}: {
  selectedItemCount: number;
  totalMonthlyPrice: number | null;
  totalWeeklyPrice: number | null;
  onCopySetupLink: () => void;
}) {
  if (selectedItemCount === 0) return null;

  return (
    <aside
      aria-label="Floating workspace summary"
      className="fixed bottom-5 right-5 z-50 hidden w-72 rounded-3xl border border-white/70 bg-white/86 p-4 text-[#201b18] shadow-[0_18px_70px_rgba(32,27,24,0.22)] backdrop-blur-xl xl:block"
    >
      <div className="flex items-center gap-3">
        <div className="grid size-11 place-items-center rounded-2xl bg-[#201b18] text-[#f5b76b]">
          <Sparkles className="size-5" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-[0.14em] text-[#b45f32]">
            Live quote
          </p>
          <p className="text-sm font-bold text-[#6c5e53]">
            {selectedItemCount} selected item{selectedItemCount === 1 ? "" : "s"}
          </p>
        </div>
      </div>
      <div className="mt-4 flex items-end justify-between gap-3 border-t border-[#eadfce] pt-4">
        <span className="text-sm font-black">Monthly</span>
        <span className="price-pop text-sm font-black">
          {totalMonthlyPrice === null ? "Check availability" : formatCurrency(totalMonthlyPrice)}
        </span>
      </div>
      <div className="mt-3 flex items-end justify-between gap-3 border-t border-[#eadfce] pt-3">
        <span className="text-sm font-black">Weekly</span>
        <span className="price-pop text-sm font-black">
          {totalWeeklyPrice === null ? "Price on request" : formatCurrency(totalWeeklyPrice)}
        </span>
      </div>
      <a
        href="#checkout"
        className="mt-4 flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#f06f61] text-sm font-black text-white shadow-lg shadow-[#f06f61]/25 transition hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-[#201b18] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f1e8]"
      >
        Review request
        <Check className="size-4" />
      </a>
      <button
        type="button"
        onClick={onCopySetupLink}
        aria-label="Copy selected product setup link"
        className="mt-2 flex h-10 w-full items-center justify-center gap-2 rounded-2xl bg-[#201b18] text-xs font-black text-white transition hover:-translate-y-0.5 hover:bg-[#3a302a] focus-visible:ring-2 focus-visible:ring-[#f06f61] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f7f1e8]"
      >
        <Copy className="size-3.5" />
        Copy Setup Link
      </button>
    </aside>
  );
}

function BenefitCard({
  icon,
  title,
  copy,
}: {
  icon: ReactNode;
  title: string;
  copy: string;
}) {
  return (
    <div className="rounded-[1.6rem] border border-white/70 bg-white/70 p-5 shadow-[0_18px_60px_rgba(77,55,35,0.1)] backdrop-blur transition duration-200 hover:-translate-y-1 hover:bg-white/85">
      <div className="grid size-11 place-items-center rounded-2xl bg-[#201b18] text-[#f5b76b]">
        {icon}
      </div>
      <h3 className="mt-5 text-lg font-black tracking-tight">{title}</h3>
      <p className="mt-2 text-sm font-medium leading-6 text-[#6c5e53]">{copy}</p>
    </div>
  );
}
