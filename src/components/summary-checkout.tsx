import { CalendarDays, CreditCard, Truck } from "lucide-react";
import { formatIdr, type RentalProduct } from "@/data/products";

type SummaryCheckoutProps = {
  selectedProducts: RentalProduct[];
};

export function SummaryCheckout({ selectedProducts }: SummaryCheckoutProps) {
  const weeklyTotal = selectedProducts.reduce((total, product) => total + product.price, 0);
  const serviceFee = selectedProducts.length > 0 ? 75000 : 0;
  const total = weeklyTotal + serviceFee;

  return (
    <aside className="rounded-[2rem] border border-white/70 bg-[#201b18] p-4 text-white shadow-[0_18px_70px_rgba(77,55,35,0.18)]">
      <div className="rounded-[1.5rem] bg-white/8 p-4">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f5b76b]">Summary</p>
        <h2 className="mt-1 text-3xl font-black tracking-tight">Ready to rent</h2>
        <p className="mt-2 text-sm leading-6 text-white/65">
          Mock pricing for a weekly workspace setup. Checkout wiring can come later.
        </p>
      </div>

      <div className="mt-4 space-y-2">
        {selectedProducts.map((product) => (
          <div key={product.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white/8 px-3 py-3">
            <span className="text-sm font-bold">{product.name}</span>
            <span className="shrink-0 text-sm font-black text-[#f5b76b]">{formatIdr(product.price)}</span>
          </div>
        ))}
        {selectedProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/25 px-4 py-8 text-center text-sm text-white/60">
            Select gear to start shaping the workspace.
          </div>
        ) : null}
      </div>

      <div className="mt-5 rounded-[1.5rem] bg-white p-4 text-[#201b18]">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-[#6c5e53]">Weekly rental</span>
          <span className="font-black">{formatIdr(weeklyTotal)}</span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-bold text-[#6c5e53]">Setup service</span>
          <span className="font-black">{formatIdr(serviceFee)}</span>
        </div>
        <div className="mt-4 border-t border-[#eadfce] pt-4">
          <div className="flex items-end justify-between gap-4">
            <span className="font-black">Estimated total</span>
            <span className="text-2xl font-black">{formatIdr(total)}</span>
          </div>
          <button
            type="button"
            className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#f06f61] px-5 text-sm font-black text-white shadow-xl shadow-[#f06f61]/25 transition hover:-translate-y-0.5 hover:bg-[#df5f52]"
          >
            <CreditCard className="size-5" />
            Reserve workspace
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-3xl bg-white/8 p-3">
          <Truck className="mb-3 size-5 text-[#f5b76b]" />
          <p className="text-sm font-black">Delivered and tuned</p>
        </div>
        <div className="rounded-3xl bg-white/8 p-3">
          <CalendarDays className="mb-3 size-5 text-[#f5b76b]" />
          <p className="text-sm font-black">Weekly flexibility</p>
        </div>
      </div>
    </aside>
  );
}
