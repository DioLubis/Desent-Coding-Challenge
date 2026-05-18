"use client";

import { useMemo, useState } from "react";
import { ProductSelection } from "@/components/product-selection";
import { SummaryCheckout } from "@/components/summary-checkout";
import { WorkspacePreview } from "@/components/workspace-preview";
import { defaultProductIds, rentalProducts } from "@/data/products";

export function ConfiguratorShell() {
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultProductIds);

  const selectedProducts = useMemo(
    () => rentalProducts.filter((product) => selectedIds.includes(product.id)),
    [selectedIds],
  );

  const toggleProduct = (id: string) => {
    setSelectedIds((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    );
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f1e8] text-[#201b18]">
      <section className="relative isolate px-4 py-5 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_10%,rgba(255,183,94,0.42),transparent_30%),radial-gradient(circle_at_82%_20%,rgba(80,173,180,0.25),transparent_26%),linear-gradient(135deg,#fff7e9_0%,#f6ecdf_52%,#e6f2ef_100%)]" />
        <div className="mx-auto flex max-w-7xl flex-col gap-5">
          <header className="flex flex-col gap-4 rounded-[2rem] border border-white/70 bg-white/55 p-4 shadow-[0_18px_70px_rgba(77,55,35,0.12)] backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#b45f32]">
                monis.rent
              </p>
              <h1 className="mt-2 max-w-3xl text-4xl font-black leading-[0.95] tracking-tight text-[#1d1a16] sm:text-6xl lg:text-7xl">
                Build your Bali work ritual.
              </h1>
            </div>
            <div className="grid grid-cols-3 gap-2 rounded-3xl bg-[#201b18] p-2 text-center text-white shadow-2xl sm:min-w-80">
              <div className="rounded-2xl bg-white/10 px-3 py-3">
                <span className="block text-xl font-black">24h</span>
                <span className="text-xs text-white/70">setup</span>
              </div>
              <div className="rounded-2xl bg-white/10 px-3 py-3">
                <span className="block text-xl font-black">Bali</span>
                <span className="text-xs text-white/70">wide</span>
              </div>
              <div className="rounded-2xl bg-[#f5b76b] px-3 py-3 text-[#201b18]">
                <span className="block text-xl font-black">7+</span>
                <span className="text-xs font-semibold">days</span>
              </div>
            </div>
          </header>

          <div className="grid gap-5 xl:grid-cols-[360px_minmax(0,1fr)_360px]">
            <ProductSelection selectedIds={selectedIds} onToggle={toggleProduct} />
            <WorkspacePreview selectedProducts={selectedProducts} />
            <SummaryCheckout selectedProducts={selectedProducts} />
          </div>
        </div>
      </section>
    </main>
  );
}
