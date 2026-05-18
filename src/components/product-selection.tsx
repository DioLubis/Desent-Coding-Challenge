"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  catalogSections,
  formatCategoryLabel,
  formatPrice,
  getMonthlyPrice,
  getProductImage,
  getWeeklyPrice,
  groupProductsBySection,
  type CatalogProduct,
  type CatalogSectionKey,
  type ConfiguratorState,
} from "@/data/products";

type ProductSelectionProps = {
  state: ConfiguratorState;
  products: CatalogProduct[];
  selectedItemCount: number;
  onToggleProduct: (id: string) => void;
};

type PriceLineProps = {
  label: string;
  value: string;
  note?: string;
};

function PriceLine({ label, value, note }: PriceLineProps) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#7b6b5e]">
        {label}
      </span>
      <span className="text-right text-sm font-black text-[#201b18]">
        <span className="block">{value}</span>
        {note ? <span className="mt-0.5 block text-[11px] font-bold text-[#b45f32]">{note}</span> : null}
      </span>
    </div>
  );
}

function ProductCard({
  product,
  isSelected,
  onClick,
}: {
  product: CatalogProduct;
  isSelected: boolean;
  onClick: () => void;
}) {
  const weeklyPrice = getWeeklyPrice(product);
  const monthlyPrice = getMonthlyPrice(product);
  const weeklyNote = product.priceWeekly === null && weeklyPrice !== null ? "Estimated" : undefined;
  const monthlyNote = product.priceMonthly === null && monthlyPrice !== null ? "Estimated" : undefined;
  const bothUnavailable = weeklyPrice === null && monthlyPrice === null;
  const priceStatus = bothUnavailable ? product.priceStatus || "Price on request" : undefined;

  return (
    <article
      className={`group overflow-hidden rounded-[1.6rem] border transition duration-200 ${
        isSelected
          ? "border-[#201b18] bg-[#201b18] text-white shadow-xl shadow-[#201b18]/15 ring-2 ring-[#f5b76b]/45"
          : "border-[#eadfce] bg-white/84 hover:-translate-y-0.5 hover:border-[#d78f43] hover:shadow-lg"
      }`}
    >
      <div className="p-3">
        <div className="relative overflow-hidden rounded-[1.35rem] bg-[#fff7e9]">
          <div className="relative aspect-4/3 w-full">
            <Image
              src={getProductImage(product)}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-contain p-4 transition duration-300 group-hover:scale-[1.02]"
            />
          </div>
          <div className="absolute left-3 top-3 rounded-full bg-[#201b18]/88 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#f5b76b]">
            {formatCategoryLabel(product.category)}
          </div>
          {isSelected ? (
            <div className="absolute right-3 top-3 rounded-full bg-[#f5b76b] px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#201b18]">
              Selected
            </div>
          ) : null}
        </div>

        <div className="px-1 pb-1 pt-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h4 className={`text-sm font-black leading-5 ${isSelected ? "text-white" : "text-[#201b18]"}`}>
                {product.name}
              </h4>
              {product.savingsLabel ? (
                <span className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${isSelected ? "bg-white/14 text-[#f5b76b]" : "bg-[#e2f2ef] text-[#245b61]"}`}>
                  {product.savingsLabel}
                </span>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClick}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                isSelected
                  ? "bg-[#f5b76b] text-[#201b18] focus-visible:ring-[#f5b76b] focus-visible:ring-offset-[#201b18]"
                  : "bg-[#201b18] text-white hover:bg-[#3a302a] focus-visible:ring-[#201b18] focus-visible:ring-offset-[#fffaf0]"
              }`}
              aria-pressed={isSelected}
            >
              {isSelected ? "Added" : "Add"}
            </button>
          </div>

          <p className={`mt-3 line-clamp-3 min-h-12 text-xs leading-5 ${isSelected ? "text-white/70" : "text-[#6c5e53]"}`}>
            {product.shortDescription || "Details coming soon."}
          </p>

          <div className={`mt-3 space-y-2 rounded-2xl border px-3 py-3 text-xs ${isSelected ? "border-white/10 bg-white/8" : "border-[#eadfce] bg-[#fffaf0]"}`}>
            {bothUnavailable ? (
              <div className="rounded-xl bg-[#f6ecdf] px-3 py-2 text-xs font-black text-[#b45f32]">
                Price on request
              </div>
            ) : null}
            <PriceLine
              label="Weekly"
              value={formatPrice(weeklyPrice, product.priceCurrency, "Price on request")}
              note={weeklyNote}
            />
            <PriceLine
              label="Monthly"
              value={formatPrice(monthlyPrice, product.priceCurrency, "Check availability")}
              note={monthlyNote}
            />
          </div>

          <div className={`mt-3 rounded-2xl border px-3 py-2 ${isSelected ? "border-white/10 bg-white/8" : "border-[#eadfce] bg-white/70"}`}>
            <p className={`text-[10px] font-black uppercase tracking-[0.14em] ${isSelected ? "text-[#f5b76b]" : "text-[#8b6c4d]"}`}>
              Specs
            </p>
            {Object.entries(product.specs ?? {})
              .slice(0, 2)
              .map(([key, value]) => (
                <div key={key} className="mt-1 flex items-start justify-between gap-3 text-[11px] leading-5">
                  <span className={isSelected ? "text-white/55" : "text-[#7b6b5e]"}>{key}</span>
                  <span className={`text-right font-semibold ${isSelected ? "text-white" : "text-[#3b2f27]"}`}>
                    {typeof value === "string" || typeof value === "number" ? String(value) : "Available"}
                  </span>
                </div>
              ))}
            {!product.specs || Object.keys(product.specs).length === 0 ? (
              <p className={`mt-1 text-xs leading-5 ${isSelected ? "text-white/70" : "text-[#6c5e53]"}`}>
                Specs unavailable.
              </p>
            ) : null}
          </div>

          {priceStatus ? (
            <p className={`mt-3 text-[11px] leading-5 ${isSelected ? "text-white/60" : "text-[#7b6b5e]"}`}>
              {priceStatus}
            </p>
          ) : (
            <p className={`mt-3 text-[11px] leading-5 ${isSelected ? "text-white/60" : "text-[#7b6b5e]"}`}>
              Estimated monthly pricing uses the live weekly or monthly rental data.
            </p>
          )}
        </div>
      </div>
    </article>
  );
}

export function ProductSelection({
  state,
  products,
  selectedItemCount,
  onToggleProduct,
}: ProductSelectionProps) {
  const groupedSections = useMemo(() => groupProductsBySection(products), [products]);
  const [activeFilter, setActiveFilter] = useState<"all" | CatalogSectionKey>("all");

  const visibleSections = groupedSections.filter(
    (section) => activeFilter === "all" || section.key === activeFilter,
  );

  return (
    <section
      aria-labelledby="product-selection-title"
      className="rounded-[1.75rem] border border-white/70 bg-white/72 p-4 shadow-[0_18px_70px_rgba(77,55,35,0.12)] backdrop-blur sm:rounded-4xl sm:p-5 lg:p-6"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#b45f32]">Catalog</p>
          <h2 id="product-selection-title" className="mt-1 text-2xl font-black tracking-tight">
            Browse the rental catalog
          </h2>
        </div>
        <span className="rounded-full bg-[#e2f2ef] px-3 py-1 text-sm font-bold text-[#245b61]">
          {selectedItemCount} selected
        </span>
      </div>

      <div className="mb-5 flex flex-wrap gap-2">
        <FilterTab label="All" active={activeFilter === "all"} onClick={() => setActiveFilter("all")} />
        {catalogSections.map((section) => {
          const count = products.filter((product) => product.section === section.key).length;

          if (count === 0) return null;

          return (
            <FilterTab
              key={section.key}
              label={`${section.label} (${count})`}
              active={activeFilter === section.key}
              onClick={() => setActiveFilter(section.key)}
            />
          );
        })}
      </div>

      <div className="space-y-6">
        {visibleSections.map((section) => (
          <section key={section.key}>
            <div className="mb-3 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.16em] text-[#78695d]">
                  {section.label}
                </h3>
                <p className="mt-1 text-xs leading-5 text-[#7b6b5e]">{section.description}</p>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {section.products.map((product) => {
                const isSelected = state.selectedProducts.some((selectedProduct) => selectedProduct.id === product.id);

                return (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isSelected={isSelected}
                    onClick={() => onToggleProduct(product.id)}
                  />
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </section>
  );
}

function FilterTab({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full px-4 py-2 text-sm font-black transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
        active
          ? "bg-[#201b18] text-white focus-visible:ring-[#201b18] focus-visible:ring-offset-[#f7f1e8]"
          : "bg-[#f6ecdf] text-[#6c5e53] hover:bg-[#eadfce] focus-visible:ring-[#f06f61] focus-visible:ring-offset-[#f7f1e8]"
      }`}
      aria-pressed={active}
    >
      {label}
    </button>
  );
}
