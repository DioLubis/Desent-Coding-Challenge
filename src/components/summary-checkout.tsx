"use client";

import { FormEvent, useState } from "react";
import { CalendarDays, Check, Send, Truck, UserRound, X } from "lucide-react";
import {
  formatIdr,
  type Accessory,
  type Chair,
  type ConfiguratorState,
  type Desk,
} from "@/data/products";
import {
  calculateRentalEstimate,
  isBestValueDuration,
  rentalDurationOptions,
} from "@/lib/pricing";

type SummaryCheckoutProps = {
  state: ConfiguratorState;
  selectedDesk?: Desk;
  selectedChair?: Chair;
  selectedAccessories: Array<{ accessory: Accessory; quantity: number }>;
};

type LeadForm = {
  fullName: string;
  whatsapp: string;
  email: string;
  duration: string;
  deliveryDate: string;
  deliveryArea: string;
};

export function SummaryCheckout({
  state,
  selectedDesk,
  selectedChair,
  selectedAccessories,
}: SummaryCheckoutProps) {
  const [form, setForm] = useState<LeadForm>({
    fullName: "",
    whatsapp: "",
    email: "",
    duration: "1 month",
    deliveryDate: "",
    deliveryArea: "",
  });
  const [isPrepared, setIsPrepared] = useState(false);

  const accessoriesTotal = selectedAccessories.reduce(
    (total, { accessory, quantity }) => total + accessory.pricePerMonth * quantity,
    0,
  );
  const hasSelection = Boolean(selectedDesk || selectedChair || selectedAccessories.length);
  const hasBestValueDuration = isBestValueDuration(form.duration);
  const estimatedRentalTotal = calculateRentalEstimate(state.totalMonthlyPrice, form.duration);
  const selectedSetupSummary = [
    selectedDesk ? { label: "Desk", name: selectedDesk.name } : null,
    selectedChair ? { label: "Chair", name: selectedChair.name } : null,
    ...selectedAccessories.map(({ accessory, quantity }) => ({
      label: "Accessory",
      name: `${accessory.name}${quantity > 1 ? ` x${quantity}` : ""}`,
    })),
  ].filter((item) => item !== null);

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
      className="relative rounded-[1.75rem] border border-white/70 bg-[#201b18] p-4 text-white shadow-[0_18px_70px_rgba(77,55,35,0.18)] sm:rounded-[2rem]"
    >
      <div className="rounded-[1.5rem] bg-white/8 p-4 shadow-inner shadow-white/5">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f5b76b]">
          Checkout
        </p>
        <h2 id="checkout-title" className="mt-1 text-3xl font-black tracking-tight">
          Your Bali workspace is almost ready.
        </h2>
        <p className="mt-2 text-sm leading-6 text-white/65">
          Send this setup request to monis.rent for digital nomad, freelancer, and startup
          workspace rentals in Bali.
        </p>
      </div>

      <div className="mt-4 space-y-2">
        <SetupLine
          label="Desk"
          name={selectedDesk?.name ?? "Choose a desk"}
          price={selectedDesk ? formatIdr(selectedDesk.pricePerMonth) : "Pending"}
          muted={!selectedDesk}
        />
        <SetupLine
          label="Chair"
          name={selectedChair?.name ?? "Choose a chair"}
          price={selectedChair ? formatIdr(selectedChair.pricePerMonth) : "Pending"}
          muted={!selectedChair}
        />
        {selectedAccessories.map(({ accessory, quantity }) => (
          <SetupLine
            key={accessory.id}
            label="Accessory"
            name={`${accessory.name}${quantity > 1 ? ` x${quantity}` : ""}`}
            price={formatIdr(accessory.pricePerMonth * quantity)}
          />
        ))}
        {!hasSelection ? (
          <div className="rounded-2xl border border-dashed border-white/25 px-4 py-8 text-center text-sm text-white/60">
            Build a setup first, then confirm the request here.
          </div>
        ) : null}
      </div>

      <div className="mt-5 rounded-[1.5rem] bg-white p-4 text-[#201b18] shadow-xl shadow-black/5">
        <div className="flex items-center justify-between text-sm">
          <span className="font-bold text-[#6c5e53]">Desk</span>
          <span className="font-black">
            {selectedDesk ? formatIdr(selectedDesk.pricePerMonth) : "Not selected"}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-bold text-[#6c5e53]">Chair</span>
          <span className="font-black">
            {selectedChair ? formatIdr(selectedChair.pricePerMonth) : "Not selected"}
          </span>
        </div>
        <div className="mt-3 flex items-center justify-between text-sm">
          <span className="font-bold text-[#6c5e53]">Accessories</span>
          <span className="font-black">{formatIdr(accessoriesTotal)}</span>
        </div>
        <div className="mt-4 border-t border-[#eadfce] pt-4">
          <div className="flex items-end justify-between gap-4">
            <span>
              <span className="block font-black">Monthly rental total</span>
              <span className="mt-1 block text-xs font-bold text-[#7b6b5e]">
                Prices are monthly rental estimates for planning.
              </span>
            </span>
            <span key={state.totalMonthlyPrice} className="price-pop text-2xl font-black">
              {formatIdr(state.totalMonthlyPrice)}
            </span>
          </div>
          <div className="mt-4 flex items-end justify-between gap-4 rounded-2xl bg-[#f6ecdf] px-3 py-3">
            <span>
              <span className="block text-xs font-bold text-[#7b6b5e]">
                Estimated rental total
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
            <span key={`${state.totalMonthlyPrice}-${form.duration}`} className="price-pop text-xl font-black">
              {formatIdr(estimatedRentalTotal)}
            </span>
          </div>
          <p className="mt-2 text-xs font-bold leading-5 text-[#7b6b5e]">
            Estimate only. The monis.rent team will confirm delivery details and final availability.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 rounded-[1.5rem] bg-white/8 p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-black text-[#f5b76b]">
          <UserRound className="size-4" />
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
          className="mt-5 flex h-14 w-full items-center justify-center gap-2 rounded-2xl bg-[#f06f61] px-5 text-sm font-black text-white shadow-xl shadow-[#f06f61]/25 transition hover:-translate-y-0.5 hover:bg-[#df5f52] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f5b76b] disabled:cursor-not-allowed disabled:opacity-45 disabled:hover:translate-y-0"
        >
          <Send className="size-5" />
          Rent This Setup
        </button>
      </form>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-3xl bg-white/8 p-3">
          <Truck className="mb-3 size-5 text-[#f5b76b]" />
          <p className="text-sm font-black">Delivered and tuned</p>
        </div>
        <div className="rounded-3xl bg-white/8 p-3">
          <CalendarDays className="mb-3 size-5 text-[#f5b76b]" />
          <p className="text-sm font-black">Monthly flexibility</p>
        </div>
      </div>

      {isPrepared ? (
        <div className="absolute inset-0 z-50 grid place-items-center rounded-[2rem] bg-[#201b18]/75 p-4 backdrop-blur-sm">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="success-title"
            aria-describedby="success-copy"
            className="workspace-pop max-h-[calc(100vh-2rem)] w-full max-w-md overflow-y-auto rounded-[1.75rem] bg-white p-5 text-[#201b18] shadow-2xl"
          >
            <button
              type="button"
              onClick={() => setIsPrepared(false)}
              className="ml-auto grid size-10 place-items-center rounded-full bg-[#f6ecdf] text-[#6c5e53] transition hover:bg-[#eadfce] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f06f61]"
              aria-label="Close success message"
            >
              <X className="size-4" />
            </button>
            <div className="mt-2 grid size-14 place-items-center rounded-2xl bg-[#e2f2ef] text-[#245b61]" aria-hidden="true">
              <Check className="size-7" />
            </div>
            <h3 id="success-title" className="mt-4 text-2xl font-black tracking-tight">
              Rental request prepared.
            </h3>
            <p id="success-copy" className="mt-2 text-sm leading-6 text-[#6c5e53]">
              Your selected Bali workspace setup is ready to send. The next step is for
              monis.rent to confirm availability, delivery timing, and any final setup details.
            </p>
            <div className="mt-4 rounded-2xl bg-[#f6ecdf] p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#b45f32]">
                Selected setup
              </p>
              <div className="mt-3 space-y-2">
                {selectedSetupSummary.map((item) => (
                  <div key={`${item.label}-${item.name}`} className="flex justify-between gap-3 text-sm">
                    <span className="font-bold text-[#6c5e53]">{item.label}</span>
                    <span className="text-right font-black">{item.name}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 border-t border-[#e5d4bd] pt-3">
                <div className="flex justify-between gap-3 text-sm">
                  <span className="font-bold text-[#6c5e53]">Monthly total</span>
                  <span className="font-black">{formatIdr(state.totalMonthlyPrice)}</span>
                </div>
                <div className="mt-2 flex justify-between gap-3 text-sm">
                  <span className="font-bold text-[#6c5e53]">
                    Estimated total ({form.duration})
                  </span>
                  <span className="font-black">{formatIdr(estimatedRentalTotal)}</span>
                </div>
              </div>
            </div>
            <div className="mt-4 rounded-2xl border border-[#eadfce] p-4">
              <p className="text-xs font-black uppercase tracking-[0.14em] text-[#b45f32]">
                Request details
              </p>
              <div className="mt-3 space-y-2 text-sm">
                <ModalDetail label="Name" value={form.fullName} />
                <ModalDetail label="WhatsApp" value={form.whatsapp} />
                <ModalDetail label="Email" value={form.email} />
                <ModalDetail label="Delivery area" value={form.deliveryArea} />
                <ModalDetail label="Delivery date" value={form.deliveryDate} />
              </div>
            </div>
            <p className="mt-4 rounded-2xl bg-[#e2f2ef] p-3 text-sm font-bold leading-6 text-[#245b61]">
              Next step: monis.rent can contact you on WhatsApp or email to confirm the setup
              and arrange delivery in Bali.
            </p>
            <button
              type="button"
              onClick={() => setIsPrepared(false)}
              className="mt-5 h-12 w-full rounded-2xl bg-[#201b18] text-sm font-black text-white transition hover:bg-[#3a302a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f06f61]"
            >
              Keep customizing
            </button>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ModalDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <span className="font-bold text-[#6c5e53]">{label}</span>
      <span className="text-right font-black">{value}</span>
    </div>
  );
}

function SetupLine({
  label,
  name,
  price,
  muted = false,
}: {
  label: string;
  name: string;
  price: string;
  muted?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-2xl px-3 py-3 ${
        muted ? "border border-dashed border-white/20 text-white/45" : "bg-white/8"
      }`}
    >
      <span className="min-w-0">
        <span className="block text-[10px] font-black uppercase tracking-[0.14em] text-white/38">
          {label}
        </span>
        <span className="block truncate text-sm font-bold">{name}</span>
      </span>
      <span className="shrink-0 text-sm font-black text-[#f5b76b]">{price}</span>
    </div>
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
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "search" | "email" | "tel" | "url" | "none" | "numeric" | "decimal";
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
        className="mt-1 h-12 w-full rounded-2xl border border-white/10 bg-white px-3 text-sm font-bold text-[#201b18] outline-none transition placeholder:text-[#9b8b7e] focus:border-[#f5b76b] focus:ring-2 focus:ring-[#f5b76b]/35"
      />
    </label>
  );
}
