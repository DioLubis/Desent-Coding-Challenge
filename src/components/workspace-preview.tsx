import Image from "next/image";
import {
  catalogSections,
  formatCategoryLabel,
  getProductImage,
  getProductSection,
  type CatalogProduct,
} from "@/data/products";

type WorkspacePreviewProps = {
  selectedProducts: Array<{ product: CatalogProduct; quantity: number }>;
};

type Placement = {
  slot: string;
  sizeClass: string;
};

const placementBySection: Record<string, Placement[]> = {
  monitors: [
    { slot: "left-1/2 top-[8%] -translate-x-1/2", sizeClass: "h-36 w-52 sm:h-44 sm:w-64" },
    { slot: "left-[24%] top-[12%]", sizeClass: "h-28 w-40 sm:h-32 sm:w-48" },
    { slot: "right-[24%] top-[12%]", sizeClass: "h-28 w-40 sm:h-32 sm:w-48" },
  ],
  "office-accessories": [
    { slot: "left-[14%] top-[50%]", sizeClass: "h-24 w-36 sm:h-28 sm:w-40" },
    { slot: "left-[34%] top-[54%]", sizeClass: "h-24 w-36 sm:h-28 sm:w-40" },
    { slot: "right-[34%] top-[54%]", sizeClass: "h-24 w-36 sm:h-28 sm:w-40" },
  ],
  "smart-home": [
    { slot: "left-[8%] top-[58%]", sizeClass: "h-22 w-32 sm:h-26 sm:w-36" },
    { slot: "right-[8%] top-[58%]", sizeClass: "h-22 w-32 sm:h-26 sm:w-36" },
  ],
  computer: [
    { slot: "right-[18%] top-[48%]", sizeClass: "h-24 w-36 sm:h-28 sm:w-40" },
    { slot: "right-[28%] top-[60%]", sizeClass: "h-22 w-32 sm:h-24 sm:w-36" },
  ],
  gaming: [
    { slot: "right-[10%] top-[34%]", sizeClass: "h-26 w-36 sm:h-32 sm:w-44" },
    { slot: "right-[10%] top-[52%]", sizeClass: "h-26 w-36 sm:h-32 sm:w-44" },
    { slot: "right-[10%] top-[70%]", sizeClass: "h-26 w-36 sm:h-32 sm:w-44" },
  ],
  "audio-video": [
    { slot: "left-[10%] top-[34%]", sizeClass: "h-26 w-36 sm:h-32 sm:w-44" },
    { slot: "left-[10%] top-[52%]", sizeClass: "h-26 w-36 sm:h-32 sm:w-44" },
  ],
};

function SceneItem({
  product,
  index,
}: {
  product: CatalogProduct;
  index: number;
}) {
  const section = getProductSection(product);
  const placements = placementBySection[section] ?? [
    { slot: "left-1/2 top-[46%] -translate-x-1/2", sizeClass: "h-24 w-36 sm:h-28 sm:w-40" },
  ];
  const placement = placements[index % placements.length];

  return (
    <div className={`absolute ${placement.slot} z-30 transition duration-300 hover:-translate-y-2`}>
      <div className={`overflow-hidden rounded-[1.35rem] border border-white/70 bg-white/90 p-2 shadow-[0_16px_36px_rgba(35,24,18,0.26)] ring-4 ring-white/55 ${placement.sizeClass}`}>
        <div className="relative h-full w-full rounded-[1.05rem] bg-[#fff7e9]">
          <Image
            src={getProductImage(product)}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, 33vw"
            className="object-contain p-3"
          />
        </div>
        <div className="mt-2 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="line-clamp-1 text-[11px] font-black text-[#201b18]">{product.name}</p>
            <p className="line-clamp-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#b45f32]">
              {formatCategoryLabel(product.category)}
            </p>
          </div>
          <span className="rounded-full bg-[#f5b76b] px-2 py-0.5 text-[10px] font-black uppercase text-[#201b18]">
            {product.priceMonthly === null && product.priceWeekly === null ? "Request" : "Ready"}
          </span>
        </div>
      </div>
    </div>
  );
}

export function WorkspacePreview({
  selectedProducts,
}: WorkspacePreviewProps) {
  const hasStarted = selectedProducts.length > 0;

  return (
    <section
      aria-label="Workspace visual preview"
      className="relative min-h-135 overflow-hidden rounded-[1.75rem] border border-white/70 bg-[#fffaf0] shadow-[0_18px_70px_rgba(77,55,35,0.14)] sm:min-h-160 sm:rounded-4xl"
    >
      <div aria-hidden="true" className="absolute inset-x-0 top-0 h-44 bg-[linear-gradient(180deg,#77c8ce_0%,#d5f1ec_100%)]" />
      <div aria-hidden="true" className="absolute inset-x-0 top-32 h-24 bg-[#f0c77b]" />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[68%] bg-[linear-gradient(160deg,#cf8b47_0%,#f3bf6b_42%,#e8a45b_100%)]" />
      <div aria-hidden="true" className="absolute left-[6%] top-14 h-20 w-20 rounded-full bg-[#f8d267] shadow-[0_0_60px_rgba(248,210,103,0.8)]" />

      <div className="relative z-10 flex h-full min-h-135 flex-col justify-between p-4 sm:min-h-160 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-black shadow-lg backdrop-blur">
            Live product setup preview
          </div>
          {hasStarted ? (
            <div className="rounded-full bg-[#f5b76b] px-4 py-2 text-sm font-black text-[#201b18] shadow-lg">
              Selected products
            </div>
          ) : null}
          <div className="rounded-full bg-[#201b18] px-4 py-2 text-sm font-bold text-white shadow-lg">
            Delivered in Bali
          </div>
        </div>

        <div className="relative mx-auto h-87.5 w-full max-w-3xl sm:h-115" aria-live="polite">
          <div className="absolute bottom-8 left-1/2 h-36 w-[82%] max-w-140 -translate-x-1/2 rounded-[50%] bg-[#6e4c37]/22 blur-sm" />
          <div className="absolute left-1/2 top-[42%] h-12 w-[72%] -translate-x-1/2 rounded-3xl bg-[#8d5836]/90 shadow-[0_22px_60px_rgba(32,27,24,0.18)]" />
          <div className="absolute left-[10%] top-[42%] h-28 w-4 rounded-full bg-[#70422d]" />
          <div className="absolute right-[10%] top-[42%] h-28 w-4 rounded-full bg-[#70422d]" />
          <div className="absolute left-[14%] top-[58%] h-36 w-4 rounded-full bg-[#70422d]" />
          <div className="absolute right-[14%] top-[58%] h-36 w-4 rounded-full bg-[#70422d]" />

          {!hasStarted ? (
            <div className="absolute inset-x-2 top-12 z-20 mx-auto flex max-w-md flex-col items-center rounded-3xl border border-white/80 bg-white/76 px-5 py-6 text-center shadow-2xl backdrop-blur sm:inset-x-4 sm:top-20 sm:rounded-4xl sm:px-6 sm:py-8">
              <h3 className="text-xl font-black tracking-tight sm:text-2xl">Select a product</h3>
              <p className="mt-2 text-sm leading-6 text-[#6c5e53]">
                Pick a product from the catalog and it will appear in the workspace scene.
              </p>
            </div>
          ) : null}

          {selectedProducts.map(({ product }, index) => (
            <SceneItem key={`${product.id}-${index}`} product={product} index={index} />
          ))}

          <div className="absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white/84 px-4 py-2 text-xs font-black text-[#4c3c31] shadow-lg backdrop-blur sm:bottom-5 sm:text-sm">
            Workspace updates instantly
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
