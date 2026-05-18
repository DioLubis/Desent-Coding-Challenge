"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  catalogSections,
  formatCategoryLabel,
  getProductImage,
  getProductSection,
  type CatalogProduct,
} from "@/data/products";

type WorkspacePreviewProps = {
  products: CatalogProduct[];
  selectedProducts: Array<{ product: CatalogProduct; quantity: number }>;
  onSelectProduct: (id: string) => void;
};

type Placement = {
  id: string;
  section: CatalogProduct["section"];
  label: string;
  slot: string;
  sizeClass: string;
  imageClass?: string;
};

const placements: Placement[] = [
  {
    id: "monitor-center",
    section: "monitors",
    label: "Monitor",
    slot: "left-1/2 top-[13%] -translate-x-1/2",
    sizeClass: "h-[8.5rem] w-[11.5rem] sm:h-44 sm:w-64",
    imageClass: "drop-shadow-[0_18px_18px_rgba(20,20,20,0.34)]",
  },
  {
    id: "monitor-left",
    section: "monitors",
    label: "Monitor",
    slot: "left-[16%] top-[18%]",
    sizeClass: "h-[6.5rem] w-36 sm:h-[8.5rem] sm:w-48",
    imageClass: "drop-shadow-[0_14px_16px_rgba(20,20,20,0.3)]",
  },
  {
    id: "monitor-right",
    section: "monitors",
    label: "Monitor",
    slot: "right-[16%] top-[18%]",
    sizeClass: "h-[6.5rem] w-36 sm:h-[8.5rem] sm:w-48",
    imageClass: "drop-shadow-[0_14px_16px_rgba(20,20,20,0.3)]",
  },
  {
    id: "computer-right",
    section: "computer",
    label: "Computer",
    slot: "right-[18%] top-[50%]",
    sizeClass: "h-20 w-28 sm:h-28 sm:w-40",
    imageClass: "drop-shadow-[0_16px_14px_rgba(20,20,20,0.32)]",
  },
  {
    id: "office-left",
    section: "office-accessories",
    label: "Desk accessory",
    slot: "left-[20%] top-[55%]",
    sizeClass: "h-[4.5rem] w-28 sm:h-24 sm:w-36",
    imageClass: "drop-shadow-[0_12px_12px_rgba(20,20,20,0.28)]",
  },
  {
    id: "office-center",
    section: "office-accessories",
    label: "Desk accessory",
    slot: "left-1/2 top-[59%] -translate-x-1/2",
    sizeClass: "h-[4.5rem] w-32 sm:h-24 sm:w-40",
    imageClass: "drop-shadow-[0_12px_12px_rgba(20,20,20,0.28)]",
  },
  {
    id: "smart-left",
    section: "smart-home",
    label: "Smart home",
    slot: "left-[6%] top-[61%]",
    sizeClass: "h-20 w-[6.5rem] sm:h-28 sm:w-36",
    imageClass: "drop-shadow-[0_14px_14px_rgba(20,20,20,0.28)]",
  },
  {
    id: "gaming-right",
    section: "gaming",
    label: "Gaming",
    slot: "right-[4%] top-[63%]",
    sizeClass: "h-[5.5rem] w-32 sm:h-[7.5rem] sm:w-[10.5rem]",
    imageClass: "drop-shadow-[0_14px_14px_rgba(20,20,20,0.28)]",
  },
  {
    id: "audio-left",
    section: "audio-video",
    label: "Audio video",
    slot: "left-[4%] top-[34%]",
    sizeClass: "h-24 w-32 sm:h-[8.5rem] sm:w-44",
    imageClass: "drop-shadow-[0_16px_16px_rgba(20,20,20,0.3)]",
  },
];

const placementBySection = placements.reduce<Record<string, Placement[]>>((acc, placement) => {
  acc[placement.section] = [...(acc[placement.section] ?? []), placement];

  return acc;
}, {});

export const maxPreviewItemsBySection = Object.fromEntries(
  Object.entries(placementBySection).map(([section, sectionPlacements]) => [
    section,
    sectionPlacements.length,
  ]),
) as Partial<Record<CatalogProduct["section"], number>>;

const visibleEmptySections = new Set([
  "monitors",
  "office-accessories",
  "smart-home",
  "computer",
  "gaming",
  "audio-video",
]);

const sectionCopy: Partial<Record<CatalogProduct["section"], string>> = {
  monitors: [
    "Pick monitor",
    "Add second monitor",
    "Add third monitor",
  ].join("|"),
  "office-accessories": "Add desk accessory",
  "smart-home": "Add smart item",
  computer: "Add computer",
  gaming: "Add gaming item",
  "audio-video": "Add audio/video",
};

function SceneItem({
  product,
  placement,
}: {
  product: CatalogProduct;
  placement: Placement;
}) {
  return (
    <div className={`absolute ${placement.slot} z-30 transition duration-300 hover:-translate-y-1`}>
      <div className={`relative ${placement.sizeClass}`}>
        <Image
          src={getProductImage(product)}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 45vw, 22vw"
          className={`object-contain ${placement.imageClass ?? ""}`}
        />
      </div>
    </div>
  );
}

function SlotPlaceholder({
  placement,
  index,
  isOpen,
  options,
  onOpen,
  onSelectProduct,
}: {
  placement: Placement;
  index: number;
  isOpen: boolean;
  options: CatalogProduct[];
  onOpen: () => void;
  onSelectProduct: (id: string) => void;
}) {
  const labelParts = sectionCopy[placement.section]?.split("|") ?? [placement.label];
  const label = labelParts[index] ?? labelParts[0] ?? placement.label;

  return (
    <div className={`absolute ${placement.slot} z-40`}>
      <button
        type="button"
        onClick={onOpen}
        className={`group grid ${placement.sizeClass} place-items-center rounded-full border-2 border-dashed border-white/85 bg-[#201b18]/34 text-center text-white shadow-[0_16px_34px_rgba(20,20,20,0.24)] backdrop-blur-sm transition hover:-translate-y-1 hover:bg-[#201b18]/46 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5b76b]`}
        aria-expanded={isOpen}
        aria-label={`${label}: choose product`}
      >
        <span className="flex size-10 items-center justify-center rounded-full bg-white/86 text-lg font-black text-[#201b18] shadow-lg transition group-hover:scale-105">
          +
        </span>
        <span className="mt-1 max-w-24 text-[11px] font-black leading-4 drop-shadow sm:max-w-28 sm:text-xs">
          {label}
        </span>
      </button>
      {isOpen ? (
        <div className="absolute left-1/2 top-full z-60 mt-3 w-70 max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-hidden rounded-3xl border border-white/80 bg-white/94 p-2 text-[#201b18] shadow-[0_22px_60px_rgba(20,20,20,0.28)] backdrop-blur-xl">
          <p className="px-3 pb-2 pt-1 text-[11px] font-black uppercase tracking-[0.14em] text-[#b45f32]">
            {formatCategoryLabel(placement.section)}
          </p>
          <div className="max-h-76 overflow-y-auto pr-1">
            {options.length > 0 ? (
              options.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  onClick={() => onSelectProduct(product.id)}
                  className="flex w-full items-center gap-3 rounded-2xl p-2 text-left transition hover:bg-[#fff3df] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f06f61]"
                >
                  <span className="relative size-14 shrink-0">
                    <Image
                      src={getProductImage(product)}
                      alt=""
                      fill
                      sizes="56px"
                      className="object-contain"
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="line-clamp-2 text-xs font-black leading-4">
                      {product.name}
                    </span>
                    <span className="mt-1 block text-[10px] font-bold uppercase tracking-[0.12em] text-[#7b6b5e]">
                      Tap to place
                    </span>
                  </span>
                </button>
              ))
            ) : (
              <span className="block px-3 py-4 text-sm font-bold text-[#6c5e53]">
                All items for this spot are already selected.
              </span>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function WorkspacePreview({
  products,
  selectedProducts,
  onSelectProduct,
}: WorkspacePreviewProps) {
  const [openSlotId, setOpenSlotId] = useState<string | null>(null);

  const selectedProductIds = useMemo(
    () => new Set(selectedProducts.map(({ product }) => product.id)),
    [selectedProducts],
  );

  const selectedBySection = useMemo(() => {
    return selectedProducts.reduce<Record<string, CatalogProduct[]>>((acc, { product }) => {
      const section = getProductSection(product);
      acc[section] = [...(acc[section] ?? []), product];

      return acc;
    }, {});
  }, [selectedProducts]);

  const productsBySection = useMemo(() => {
    return products.reduce<Record<string, CatalogProduct[]>>((acc, product) => {
      const section = getProductSection(product);
      acc[section] = [...(acc[section] ?? []), product];

      return acc;
    }, {});
  }, [products]);

  const scenePlacements = placements.map((placement) => {
    const sectionItems = selectedBySection[placement.section] ?? [];
    const sectionPlacements = placementBySection[placement.section] ?? [];
    const sectionIndex = sectionPlacements.findIndex((item) => item.id === placement.id);
    const product = sectionItems[sectionIndex] ?? null;
    const shouldShowPlaceholder =
      !product &&
      visibleEmptySections.has(placement.section) &&
      sectionIndex === sectionItems.length;

    return { placement, product, shouldShowPlaceholder, sectionIndex };
  });

  return (
    <section
      aria-label="Workspace visual preview"
      className="relative min-h-135 overflow-hidden rounded-[1.75rem] border border-white/70 bg-[#201b18] shadow-[0_18px_70px_rgba(77,55,35,0.14)] sm:min-h-160 sm:rounded-4xl"
    >
      <Image
        src="/products/roombg.png"
        alt=""
        fill
        priority
        sizes="(max-width: 768px) 100vw, 1280px"
        className="object-cover"
      />
      <div aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-black/5 via-transparent to-black/18" />

      <div className="relative z-10 flex h-full min-h-135 flex-col justify-between p-4 sm:min-h-160 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="rounded-full bg-white/86 px-4 py-2 text-sm font-black shadow-lg backdrop-blur">
            Live product setup preview
          </div>
          <div className="rounded-full bg-[#201b18] px-4 py-2 text-sm font-bold text-white shadow-lg">
            Delivered in Bali
          </div>
        </div>

        <div className="relative mx-auto h-95 w-full max-w-4xl sm:h-120" aria-live="polite">
          {scenePlacements.map(({ placement, product, shouldShowPlaceholder, sectionIndex }) =>
            product ? (
              <SceneItem key={placement.id} product={product} placement={placement} />
            ) : shouldShowPlaceholder ? (
              <SlotPlaceholder
                key={placement.id}
                placement={placement}
                index={sectionIndex}
                isOpen={openSlotId === placement.id}
                options={(productsBySection[placement.section] ?? []).filter(
                  (productOption) => !selectedProductIds.has(productOption.id),
                )}
                onOpen={() => setOpenSlotId((current) => (current === placement.id ? null : placement.id))}
                onSelectProduct={(id) => {
                  onSelectProduct(id);
                  setOpenSlotId(null);
                }}
              />
            ) : null,
          )}

          <div className="absolute bottom-3 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white/86 px-4 py-2 text-xs font-black text-[#4c3c31] shadow-lg backdrop-blur sm:bottom-5 sm:text-sm">
            Click a floating spot to place an item
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3 sm:gap-3">
          {[
            selectedProducts[0]?.product.name ?? "Choose product",
            selectedProducts[1]?.product.name ?? "Add more items",
            `${selectedProducts.length} selected`,
          ].map((item) => (
            <div key={item} className="rounded-3xl bg-white/72 px-4 py-3 text-xs font-black shadow-lg backdrop-blur sm:text-sm">
              {item}
            </div>
          ))}
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3 sm:gap-3">
          {catalogSections.map((section) => (
            <div key={section.key} className="rounded-3xl border border-white/70 bg-white/65 px-4 py-3 text-xs font-bold text-[#6c5e53] backdrop-blur">
              <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-[#b45f32]">
                {section.label}
              </span>
              <span className="mt-1 block">{section.description}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
