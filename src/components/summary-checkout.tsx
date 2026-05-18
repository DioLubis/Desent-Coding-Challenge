"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import {
  calculateRentalEstimate,
  isBestValueDuration,
  rentalDurationOptions,
} from "@/lib/pricing";
import {
  calculateSelectedSetupTotal,
  formatCategoryLabel,
  formatPrice,
  getMonthlyPrice,
  getProductImage,
  getWeeklyPrice,
  type CatalogProduct,
  type ConfiguratorState,
} from "@/data/products";

type SummaryCheckoutProps = {
  state: ConfiguratorState;
  selectedProducts: Array<{ product: CatalogProduct; quantity: number }>;
};

type LeadForm = {
  fullName: string;
  whatsapp: string;
  email: string;
  duration: string;
  deliveryDate: string;
  deliveryArea: string;
};

export function SummaryCheckout({ selectedProducts }: SummaryCheckoutProps) {
  const [form, setForm] = useState<LeadForm>({
    fullName: "",
    whatsapp: "",
    email: "",
    duration: "1 month",
    deliveryDate: "",
    deliveryArea: "",
  });
  const [isPrepared, setIsPrepared] = useState(false);

  const pricingSummary = calculateSelectedSetupTotal(selectedProducts);
  const hasSelection = selectedProducts.length > 0;
  const hasBestValueDuration = isBestValueDuration(form.duration);
  const estimatedRentalTotal = calculateRentalEstimate(pricingSummary.monthlyTotal, form.duration);

  const updateForm = (field: keyof LeadForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPrepared(true);
  };

  return (
    <section
      aria-labelledby="checkout-title"
      className="relative rounded-[1.75rem] border border-white/70 bg-[#201b18] p-4 text-white shadow-[0_18px_70px_rgba(77,55,35,0.18)] sm:rounded-4xl"
    >
      <div className="rounded-3xl bg-white/8 p-4 shadow-inner shadow-white/5">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f5b76b]">
          Checkout
        </p>
        <h2 id="checkout-title" className="mt-1 text-3xl font-black tracking-tight">
          Your product request is almost ready.
        </h2>
        <p className="mt-2 text-sm leading-6 text-white/65">
          Weekly and monthly rental prices are pulled from the Monis catalog. Items with no visible price stay in the setup but are excluded from totals.
        </p>
      </div>

      <div className="mt-4 space-y-3">
        {selectedProducts.map(({ product, quantity }) => {
          const weeklyPrice = getWeeklyPrice(product);
          const monthlyPrice = getMonthlyPrice(product);
          const weeklyLabel = product.priceWeekly === null && weeklyPrice !== null ? "Estimated weekly" : "Weekly";
          const monthlyLabel = product.priceMonthly === null && monthlyPrice !== null ? "Estimated monthly" : "Monthly";
          const priceUnavailable = weeklyPrice === null && monthlyPrice === null;

          return (
            <article
              key={product.id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/8 p-3"
            >
              <div className="flex gap-3">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-[#fff7e9]">
                  <Image
                    src={getProductImage(product)}
                    alt={product.name}
                    fill
                    sizes="80px"
                    className="object-contain p-2"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="text-sm font-black leading-5">{product.name}</h3>
                      <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.14em] text-white/55">
                        {formatCategoryLabel(product.category)}
                      </p>
                    </div>
                    <span className="rounded-full bg-[#f5b76b] px-2 py-0.5 text-[10px] font-black uppercase text-[#201b18]">
                      {quantity}x
                    </span>
                  </div>

                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/70">
                    {product.shortDescription || "Details coming soon."}
                  </p>
                </div>
              </div>

              <div className="mt-3 grid gap-2 rounded-2xl bg-white/5 p-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/55">
                    {weeklyLabel}
                  </span>
                  <span className="font-black">
                    {formatPrice(weeklyPrice, product.priceCurrency, "Price on request")}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-white/55">
                    {monthlyLabel}
                  </span>
                  <span className="font-black">
                    {formatPrice(monthlyPrice, product.priceCurrency, "Check availability")}
                  </span>
                </div>
                {priceUnavailable ? (
                  <div className="rounded-xl bg-[#f5b76b]/15 px-3 py-2 text-xs font-black text-[#f5b76b]">
                    Price on request
                  </div>
                ) : null}
                {product.priceNote ? (
                  <p className="text-[11px] leading-5 text-white/60">
                    {product.priceNote}
                  </p>
                ) : (
                  <p className="text-[11px] leading-5 text-white/60">
                    Estimated monthly pricing uses the available weekly or monthly rental data.
                  </p>
                )}
              </div>
            </article>
          );
        })}
        {!hasSelection ? (
          <div className="rounded-2xl border border-dashed border-white/25 px-4 py-8 text-center text-sm text-white/60">
            Build a product request first, then confirm it here.
          </div>
        ) : null}
      </div>

      <div className="mt-5 rounded-3xl bg-white p-4 text-[#201b18] shadow-xl shadow-black/5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-[#6c5e53]">Monthly rental estimate</span>
          <span className="font-black">
            {pricingSummary.monthlyTotal === null
              ? "Price on request"
              : formatPrice(pricingSummary.monthlyTotal)}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-bold text-[#6c5e53]">Weekly rental snapshot</span>
          <span className="font-black">
            {pricingSummary.weeklyTotal === null
              ? "Price on request"
              : formatPrice(pricingSummary.weeklyTotal)}
          </span>
        </div>
        <div className="mt-4 rounded-2xl bg-[#f6ecdf] px-3 py-3 text-sm text-[#201b18]">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#7b6b5e]">
            Pricing note
          </p>
          <p className="mt-1 text-xs font-medium leading-6 text-[#6c5e53]">
            Estimated monthly pricing is based on the available weekly or monthly rental data.
            Items with no visible rental price are kept in the setup but excluded from totals.
          </p>
        </div>
        {pricingSummary.unavailableCount > 0 ? (
          <p className="mt-3 text-xs font-bold leading-5 text-[#b45f32]">
            {pricingSummary.unavailableCount} selected item{pricingSummary.unavailableCount === 1 ? "" : "s"} are marked price on request.
          </p>
        ) : null}
        <div className="mt-4 border-t border-[#eadfce] pt-4">
          <div className="flex items-end justify-between gap-4">
            <span>
              <span className="block font-black">Estimated total rental cost</span>
              <span className="mt-1 block text-xs font-bold text-[#7b6b5e]">
                {form.duration} rental duration
              </span>
            </span>
            <span key={`${pricingSummary.monthlyTotal ?? "request"}-${form.duration}`} className="price-pop text-xl font-black">
              {estimatedRentalTotal === null
                ? "Price on request"
                : formatPrice(estimatedRentalTotal)}
            </span>
          </div>
          <div className="mt-4 flex items-end justify-between gap-4 rounded-2xl bg-[#f6ecdf] px-3 py-3">
            <span>
              <span className="block text-xs font-bold text-[#7b6b5e]">
                Selected rental duration
              </span>
              <span className="mt-1 flex flex-wrap items-center gap-2 text-sm font-black">
                {form.duration}
                {hasBestValueDuration ? (
                  <span className="rounded-full bg-[#201b18] px-2 py-0.5 text-[10px] font-black uppercase text-[#f5b76b]">
                    Best Value
                  </span>
                ) : null}
              </span>
            </span>
            <span className="text-sm font-black text-[#201b18]">
              {selectedProducts.length} items
            </span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 rounded-3xl bg-white/8 p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-black text-[#f5b76b]">
          Request details
        </div>
        <div className="space-y-3">
          <CheckoutInput
            label="Full name"
            value={form.fullName}
            onChange={(value) => updateForm("fullName", value)}
            placeholder="Your full name"
            autoComplete="name"
            required
          />
          <CheckoutInput
            label="WhatsApp number"
            value={form.whatsapp}
            onChange={(value) => updateForm("whatsapp", value)}
            placeholder="+62 812..."
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            required
          />
          <CheckoutInput
            label="Email address"
            value={form.email}
            onChange={(value) => updateForm("email", value)}
            placeholder="you@email.com"
            type="email"
            inputMode="email"
            autoComplete="email"
            required
          />
          <label className="block">
            <span className="flex items-center justify-between gap-2 text-xs font-bold text-white/62">
              Rental duration
              {hasBestValueDuration ? (
                <span className="rounded-full bg-[#f5b76b] px-2 py-0.5 text-[10px] font-black uppercase text-[#201b18]">
                  Best Value
                </span>
              ) : null}
            </span>
            <select
              value={form.duration}
              onChange={(event) => updateForm("duration", event.target.value)}
              required
              className="mt-1 h-12 w-full rounded-2xl border border-white/10 bg-white px-3 text-sm font-bold text-[#201b18] outline-none transition focus:border-[#f5b76b] focus:ring-2 focus:ring-[#f5b76b]/35"
            >
              {rentalDurationOptions.map((option) => (
                <option key={option.label} value={option.label}>
                  {option.label}
                  {isBestValueDuration(option.label) ? " - Best Value" : ""}
                </option>
              ))}
            </select>
          </label>
          <CheckoutInput
            label="Preferred delivery date"
            type="date"
            value={form.deliveryDate}
            onChange={(value) => updateForm("deliveryDate", value)}
            autoComplete="off"
            required
          />
          <CheckoutInput
            label="Delivery area in Bali"
            value={form.deliveryArea}
            onChange={(value) => updateForm("deliveryArea", value)}
            placeholder="Canggu, Ubud, Sanur..."
            autoComplete="street-address"
            required
          />
        </div>

        <button
          type="submit"
          disabled={!hasSelection}
          className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#f06f61] px-5 text-sm font-black text-white shadow-xl shadow-[#f06f61]/25 transition hover:-translate-y-0.5 hover:bg-[#df5f52] focus-visible:ring-2 focus-visible:ring-[#f5b76b] focus-visible:ring-offset-2 focus-visible:ring-offset-[#201b18] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
        >
          Submit Request
        </button>

        {isPrepared ? (
          <div className="mt-4 rounded-2xl border border-[#f5b76b]/30 bg-[#fff7e9] px-4 py-3 text-sm font-bold text-[#201b18]">
            Request prepared. The team can review the live catalog selection.
          </div>
        ) : null}
      </form>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-3xl bg-white/8 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">Items</p>
          <p className="mt-2 text-2xl font-black">{selectedProducts.length}</p>
        </div>
        <div className="rounded-3xl bg-white/8 p-3">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-white/60">Source</p>
          <p className="mt-2 text-sm font-black leading-5">JSON catalog</p>
        </div>
      </div>
    </section>
  );
}

function CheckoutInput({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: React.InputHTMLAttributes<HTMLInputElement>["inputMode"];
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-xs font-bold text-white/62">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        required={required}
        className="mt-1 h-12 w-full rounded-2xl border border-white/10 bg-white px-3 text-sm font-bold text-[#201b18] outline-none transition focus:border-[#f5b76b] focus:ring-2 focus:ring-[#f5b76b]/35"
      />
    </label>
  );
}
