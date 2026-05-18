"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  formatCategoryLabel,
  getProductImage,
  getProductSection,
  type CatalogProduct,
} from "@/data/products";

type WorkspacePreviewProps = {
  products: CatalogProduct[];
  selectedProducts: Array<{ product: CatalogProduct; quantity: number }>;
  onSelectProduct: (id: string) => void;
  onRemoveProduct: (id: string) => void;
  onReplaceProduct: (currentId: string, nextId: string) => void;
};

type Slot = {
  id: string;
  label: string;
  menuLabel: string;
  zIndex?: string;
  accepts: (product: CatalogProduct) => boolean;
  placement: (product?: CatalogProduct) => {
    slot: string;
    sizeClass: string;
    imageClass?: string;
  };
};

type AssignedSlot = {
  slot: Slot;
  product: CatalogProduct | null;
};

type SlotOverrides = Record<string, string>;

const monitorImageClass = "drop-shadow-[0_12px_14px_rgba(20,20,20,0.36)]";
const desktopImageClass = "drop-shadow-[0_10px_12px_rgba(20,20,20,0.34)]";

function normalizedText(product: CatalogProduct) {
  return `${product.id} ${product.name}`.toLowerCase();
}

function isMonitor(product: CatalogProduct) {
  return getProductSection(product) === "monitors";
}

function isLaptop(product: CatalogProduct) {
  return getProductSection(product) === "computer" && normalizedText(product).includes("laptop");
}

function isCompactComputer(product: CatalogProduct) {
  return getProductSection(product) === "computer" && !isLaptop(product);
}

function isKeyboard(product: CatalogProduct) {
  return normalizedText(product).includes("keyboard");
}

function isMouse(product: CatalogProduct) {
  return normalizedText(product).includes("mouse");
}

function isWebcam(product: CatalogProduct) {
  return normalizedText(product).includes("webcam");
}

function isDeskAccessory(product: CatalogProduct) {
  return getProductSection(product) === "office-accessories" && !isKeyboard(product) && !isMouse(product) && !isWebcam(product);
}

function isAudio(product: CatalogProduct) {
  return getProductSection(product) === "audio-video";
}

function isGaming(product: CatalogProduct) {
  return getProductSection(product) === "gaming";
}

function isSmartTv(product: CatalogProduct) {
  const text = normalizedText(product);

  return isGaming(product) && text.includes("smart tv");
}

function isConsoleOrGamingAccessory(product: CatalogProduct) {
  return isGaming(product) && !isSmartTv(product);
}

function isWallDisplay(product: CatalogProduct) {
  const text = normalizedText(product);

  return isSmartTv(product) || text.includes("google-tv-home-projector");
}

function isSmartHome(product: CatalogProduct) {
  return getProductSection(product) === "smart-home";
}

const slots: Slot[] = [
  {
    id: "monitor-center",
    label: "Monitor",
    menuLabel: "Center monitor",
    accepts: isMonitor,
    placement: () => ({
      slot: "left-[50%] top-[39%] -translate-x-1/2",
      sizeClass: "h-24 w-[8.5rem] sm:h-[7.75rem] sm:w-44",
      imageClass: monitorImageClass,
    }),
  },
  {
    id: "monitor-left",
    label: "Monitor",
    menuLabel: "Left monitor",
    accepts: isMonitor,
    placement: () => ({
      slot: "left-[42%] top-[41%] -translate-x-1/2",
      sizeClass: "h-[5.5rem] w-32 sm:h-[7.25rem] sm:w-[10.5rem]",
      imageClass: monitorImageClass,
    }),
  },
  {
    id: "right-display",
    label: "Monitor / laptop",
    menuLabel: "Right monitor or laptop",
    accepts: (product) => isMonitor(product) || isLaptop(product),
    placement: (product) =>
      product && isLaptop(product)
        ? {
            slot: "left-[62%] top-[49%] -translate-x-1/2",
            sizeClass: "h-12 w-24 sm:h-16 sm:w-32",
            imageClass: desktopImageClass,
          }
        : {
            slot: "left-[58%] top-[41%] -translate-x-1/2",
            sizeClass: "h-[5.5rem] w-32 sm:h-[7.25rem] sm:w-[10.5rem]",
            imageClass: monitorImageClass,
          },
  },
  {
    id: "audio-left",
    label: "Audio",
    menuLabel: "Audio left of keyboard",
    zIndex: "z-[35]",
    accepts: isAudio,
    placement: () => ({
      slot: "left-[40%] top-[48%] -translate-x-1/2",
      sizeClass: "h-14 w-20 sm:h-20 sm:w-28",
      imageClass: desktopImageClass,
    }),
  },
  {
    id: "webcam",
    label: "Webcam",
    menuLabel: "Webcam above center monitor",
    zIndex: "z-[55]",
    accepts: isWebcam,
    placement: () => ({
      slot: "left-[50%] top-[37%] -translate-x-1/2",
      sizeClass: "h-8 w-12 sm:h-10 sm:w-16",
      imageClass: desktopImageClass,
    }),
  },
  {
    id: "keyboard",
    label: "Keyboard",
    menuLabel: "Keyboard",
    zIndex: "z-[45]",
    accepts: isKeyboard,
    placement: () => ({
      slot: "left-[49%] top-[50%] -translate-x-1/2",
      sizeClass: "h-10 w-[7.5rem] sm:h-[3.25rem] sm:w-[10.5rem]",
      imageClass: desktopImageClass,
    }),
  },
  {
    id: "mouse",
    label: "Mouse",
    menuLabel: "Mouse right of keyboard",
    zIndex: "z-[45]",
    accepts: isMouse,
    placement: () => ({
      slot: "left-[57%] top-[50%] -translate-x-1/2",
      sizeClass: "h-10 w-14 sm:h-[3.25rem] sm:w-[4.5rem]",
      imageClass: desktopImageClass,
    }),
  },
  {
    id: "desk-accessory",
    label: "Accessory",
    menuLabel: "Desk accessory",
    accepts: isDeskAccessory,
    placement: () => ({
      slot: "left-[34%] top-[50%] -translate-x-1/2",
      sizeClass: "h-12 w-20 sm:h-[4.25rem] sm:w-28",
      imageClass: desktopImageClass,
    }),
  },
  {
    id: "compact-computer",
    label: "Computer / console",
    menuLabel: "Compact computer or console",
    accepts: (product) => isCompactComputer(product) || isConsoleOrGamingAccessory(product),
    placement: () => ({
      slot: "left-[68%] top-[50%] -translate-x-1/2",
      sizeClass: "h-12 w-20 sm:h-18 sm:w-30",
      imageClass: desktopImageClass,
    }),
  },
  {
    id: "wall-display",
    label: "TV / projector",
    menuLabel: "Wall TV or projector",
    zIndex: "z-[25]",
    accepts: isWallDisplay,
    placement: () => ({
      slot: "left-[50%] top-[22%] -translate-x-1/2",
      sizeClass: "h-24 w-44 sm:h-36 sm:w-64",
      imageClass: "drop-shadow-[0_18px_24px_rgba(20,20,20,0.42)]",
    }),
  },
  {
    id: "smart-left",
    label: "Smart item",
    menuLabel: "Smart home",
    accepts: isSmartHome,
    placement: () => ({
      slot: "left-[20%] top-[63%] -translate-x-1/2",
      sizeClass: "h-20 w-28 sm:h-32 sm:w-44",
      imageClass: "drop-shadow-[0_16px_20px_rgba(20,20,20,0.38)]",
    }),
  },
];

export const maxPreviewItemsBySection = {
  monitors: 3,
  "office-accessories": 4,
  "smart-home": 1,
  computer: 2,
  gaming: 2,
  "audio-video": 2,
} as Partial<Record<CatalogProduct["section"], number>>;

function assignProductsToSlots(selectedProducts: CatalogProduct[], slotOverrides: SlotOverrides = {}) {
  const assignments = new Map<string, CatalogProduct>();
  const usedProductIds = new Set<string>();

  selectedProducts.forEach((product) => {
    const slotId = slotOverrides[product.id];
    const slot = slots.find((item) => item.id === slotId);

    if (!slot || !slot.accepts(product) || assignments.has(slot.id)) return;

    assignments.set(slot.id, product);
    usedProductIds.add(product.id);
  });

  const assignMatchingProducts = (slotIds: string[]) => {
    slotIds.forEach((slotId) => {
      const slot = slots.find((item) => item.id === slotId);
      if (!slot) return;

      const product = selectedProducts.find(
        (item) => !usedProductIds.has(item.id) && slot.accepts(item),
      );

      if (!product) return;

      assignments.set(slot.id, product);
      usedProductIds.add(product.id);
    });
  };

  assignMatchingProducts([
    "monitor-center",
    "monitor-left",
    "right-display",
    "audio-left",
    "webcam",
    "keyboard",
    "mouse",
    "desk-accessory",
    "compact-computer",
    "wall-display",
    "smart-left",
  ]);

  return assignments;
}

export function canPlaceProductInPreview(product: CatalogProduct, selectedProducts: CatalogProduct[]) {
  if (selectedProducts.some((item) => item.id === product.id)) return true;

  const assignments = assignProductsToSlots(selectedProducts);

  return slots.some((slot) => slot.accepts(product) && !assignments.has(slot.id));
}

function getSlotOptions(slot: Slot, products: CatalogProduct[], selectedProductIds: Set<string>) {
  return products.filter((product) => slot.accepts(product) && !selectedProductIds.has(product.id));
}

function ProductOption({
  product,
  onClick,
}: {
  product: CatalogProduct;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
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
          {formatCategoryLabel(product.category)}
        </span>
      </span>
    </button>
  );
}

function SlotMenu({
  slot,
  product,
  options,
  onSelectProduct,
  onReplaceProduct,
  onRemoveProduct,
}: {
  slot: Slot;
  product: CatalogProduct | null;
  options: CatalogProduct[];
  onSelectProduct: (id: string) => void;
  onReplaceProduct: (currentId: string, nextId: string) => void;
  onRemoveProduct: (id: string) => void;
}) {
  return (
    <div className="absolute left-1/2 top-full z-[100] mt-2 w-72 max-w-[calc(100vw-2rem)] -translate-x-1/2 overflow-hidden rounded-3xl border border-white/80 bg-white/94 p-2 text-[#201b18] shadow-[0_22px_60px_rgba(20,20,20,0.28)] backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3 px-3 pb-2 pt-1">
        <p className="text-[11px] font-black uppercase tracking-[0.14em] text-[#b45f32]">
          {slot.menuLabel}
        </p>
        {product ? (
          <button
            type="button"
            onClick={() => onRemoveProduct(product.id)}
            className="rounded-full bg-[#201b18] px-3 py-1 text-[10px] font-black uppercase text-white transition hover:bg-[#3a302a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f06f61]"
          >
            Remove
          </button>
        ) : null}
      </div>
      <div className="max-h-76 overflow-y-auto pr-1">
        {options.length > 0 ? (
          options.map((option) => (
            <ProductOption
              key={option.id}
              product={option}
              onClick={() =>
                product ? onReplaceProduct(product.id, option.id) : onSelectProduct(option.id)
              }
            />
          ))
        ) : (
          <span className="block px-3 py-4 text-sm font-bold text-[#6c5e53]">
            No other matching items available.
          </span>
        )}
      </div>
    </div>
  );
}

function SlotControl({
  assignedSlot,
  isOpen,
  options,
  onOpen,
  onSelectProduct,
  onReplaceProduct,
  onRemoveProduct,
}: {
  assignedSlot: AssignedSlot;
  isOpen: boolean;
  options: CatalogProduct[];
  onOpen: () => void;
  onSelectProduct: (id: string) => void;
  onReplaceProduct: (currentId: string, nextId: string) => void;
  onRemoveProduct: (id: string) => void;
}) {
  const { slot, product } = assignedSlot;
  const placement = slot.placement(product ?? undefined);
  const zIndex = isOpen ? "z-[90]" : slot.zIndex ?? "z-30";

  return (
    <div className={`absolute ${placement.slot} ${zIndex}`}>
      {product ? (
        <button
          type="button"
          onClick={onOpen}
          className={`relative block ${placement.sizeClass} transition duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5b76b]`}
          aria-label={`Change or remove ${product.name}`}
          aria-expanded={isOpen}
        >
          <Image
            src={getProductImage(product)}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 32vw, 18vw"
            className={`object-contain ${placement.imageClass ?? ""}`}
          />
        </button>
      ) : (
        <button
          type="button"
          onClick={onOpen}
          className={`grid ${placement.sizeClass} scale-[0.7] place-items-center rounded-full border border-dashed border-white/85 bg-[#201b18]/28 text-center text-white shadow-[0_10px_24px_rgba(20,20,20,0.22)] backdrop-blur-sm transition hover:-translate-y-0.5 hover:bg-[#201b18]/42 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f5b76b]`}
          aria-label={`${slot.label}: choose product`}
          aria-expanded={isOpen}
        >
          <span className="flex size-7 items-center justify-center rounded-full bg-white/88 text-sm font-black text-[#201b18] shadow-lg">
            +
          </span>
        </button>
      )}

      {isOpen ? (
        <SlotMenu
          slot={slot}
          product={product}
          options={options}
          onSelectProduct={onSelectProduct}
          onReplaceProduct={onReplaceProduct}
          onRemoveProduct={onRemoveProduct}
        />
      ) : null}
    </div>
  );
}

export function WorkspacePreview({
  products,
  selectedProducts,
  onSelectProduct,
  onRemoveProduct,
  onReplaceProduct,
}: WorkspacePreviewProps) {
  const [openSlotId, setOpenSlotId] = useState<string | null>(null);

  const selectedProductList = useMemo(
    () => selectedProducts.map(({ product }) => product),
    [selectedProducts],
  );

  const selectedProductIds = useMemo(
    () => new Set(selectedProductList.map((product) => product.id)),
    [selectedProductList],
  );

  const assignedProducts = useMemo(
    () => assignProductsToSlots(selectedProductList),
    [selectedProductList],
  );

  const assignedSlots = slots.map<AssignedSlot>((slot) => ({
    slot,
    product: assignedProducts.get(slot.id) ?? null,
  }));

  return (
    <section
      aria-label="Workspace visual preview"
      className="relative min-h-135 overflow-visible rounded-[1.75rem] border border-white/70 bg-[#201b18] shadow-[0_18px_70px_rgba(77,55,35,0.14)] sm:min-h-160 sm:rounded-4xl"
    >
      <div className="absolute inset-0 overflow-hidden rounded-[1.75rem] sm:rounded-4xl">
        <Image
          src="/products/roombg.png"
          alt=""
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1280px"
          className="object-cover"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-linear-to-b from-black/5 via-transparent to-black/18" />
      </div>

      <div className="relative z-50 flex items-center justify-between gap-3 p-4 sm:p-6">
        <div className="rounded-full bg-white/86 px-4 py-2 text-sm font-black shadow-lg backdrop-blur">
          Live product setup preview
        </div>
        <div className="rounded-full bg-[#201b18] px-4 py-2 text-sm font-bold text-white shadow-lg">
          Delivered in Bali
        </div>
      </div>

      <div className="absolute inset-0 z-20" aria-live="polite">
        {assignedSlots.map((assignedSlot) => (
          <SlotControl
            key={assignedSlot.slot.id}
            assignedSlot={assignedSlot}
            isOpen={openSlotId === assignedSlot.slot.id}
            options={getSlotOptions(assignedSlot.slot, products, selectedProductIds)}
            onOpen={() =>
              setOpenSlotId((current) =>
                current === assignedSlot.slot.id ? null : assignedSlot.slot.id,
              )
            }
            onSelectProduct={(id) => {
              onSelectProduct(id);
              setOpenSlotId(null);
            }}
            onReplaceProduct={(currentId, nextId) => {
              onReplaceProduct(currentId, nextId);
              setOpenSlotId(null);
            }}
            onRemoveProduct={(id) => {
              onRemoveProduct(id);
              setOpenSlotId(null);
            }}
          />
        ))}
      </div>
    </section>
  );
}
