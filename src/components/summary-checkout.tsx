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

type SummaryCheckoutProps = {
  state: ConfiguratorState;
  selectedDesk?: Desk;
  selectedChair?: Chair;
  selectedAccessories: Array<{ accessory: Accessory; quantity: number }>;
};

type LeadForm = {
  name: string;
  contact: string;
  duration: string;
  deliveryDate: string;
};

export function SummaryCheckout({
  state,
  selectedDesk,
  selectedChair,
  selectedAccessories,
}: SummaryCheckoutProps) {
  const [form, setForm] = useState<LeadForm>({
    name: "",
    contact: "",
    duration: "1 month",
    deliveryDate: "",
  });
  const [isPrepared, setIsPrepared] = useState(false);

  const accessoriesTotal = selectedAccessories.reduce(
    (total, { accessory, quantity }) => total + accessory.pricePerMonth * quantity,
    0,
  );
  const hasSelection = Boolean(selectedDesk || selectedChair || selectedAccessories.length);

  const updateForm = (field: keyof LeadForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPrepared(true);
  };

  return (
    <aside className="relative rounded-[1.75rem] border border-white/70 bg-[#201b18] p-4 text-white shadow-[0_18px_70px_rgba(77,55,35,0.18)] sm:rounded-[2rem]">
      <div className="rounded-[1.5rem] bg-white/8 p-4 shadow-inner shadow-white/5">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#f5b76b]">
          Checkout
        </p>
        <h2 className="mt-1 text-3xl font-black tracking-tight">
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
            <span className="font-black">Monthly rental total</span>
            <span className="text-2xl font-black">{formatIdr(state.totalMonthlyPrice)}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-4 rounded-[1.5rem] bg-white/8 p-4">
        <div className="mb-4 flex items-center gap-2 text-sm font-black text-[#f5b76b]">
          <UserRound className="size-4" />
          Request details
        </div>
        <div className="space-y-3">
          <CheckoutInput
            label="Name"
            value={form.name}
            onChange={(value) => updateForm("name", value)}
            placeholder="Your name"
            required
          />
          <CheckoutInput
            label="WhatsApp or email"
            value={form.contact}
            onChange={(value) => updateForm("contact", value)}
            placeholder="+62... or you@email.com"
            required
          />
          <label className="block">
            <span className="text-xs font-bold text-white/62">Rental duration</span>
            <select
              value={form.duration}
              onChange={(event) => updateForm("duration", event.target.value)}
              className="mt-1 h-12 w-full rounded-2xl border border-white/10 bg-white px-3 text-sm font-bold text-[#201b18] outline-none transition focus:border-[#f5b76b] focus:ring-2 focus:ring-[#f5b76b]/35"
            >
              <option>1 month</option>
              <option>2 months</option>
              <option>3 months</option>
              <option>6 months</option>
              <option>Flexible</option>
            </select>
          </label>
          <CheckoutInput
            label="Preferred delivery date"
            type="date"
            value={form.deliveryDate}
            onChange={(value) => updateForm("deliveryDate", value)}
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
          <div className="workspace-pop w-full max-w-sm rounded-[1.75rem] bg-white p-5 text-[#201b18] shadow-2xl">
            <button
              type="button"
              onClick={() => setIsPrepared(false)}
              className="ml-auto grid size-10 place-items-center rounded-full bg-[#f6ecdf] text-[#6c5e53] transition hover:bg-[#eadfce] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f06f61]"
              aria-label="Close success message"
            >
              <X className="size-4" />
            </button>
            <div className="mt-2 grid size-14 place-items-center rounded-2xl bg-[#e2f2ef] text-[#245b61]">
              <Check className="size-7" />
            </div>
            <h3 className="mt-4 text-2xl font-black tracking-tight">Request prepared.</h3>
            <p className="mt-2 text-sm leading-6 text-[#6c5e53]">
              We prepared your selected workspace setup with your contact details. Payment
              and confirmation can be wired in later.
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
    </aside>
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
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
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
        required={required}
        className="mt-1 h-12 w-full rounded-2xl border border-white/10 bg-white px-3 text-sm font-bold text-[#201b18] outline-none transition placeholder:text-[#9b8b7e] focus:border-[#f5b76b] focus:ring-2 focus:ring-[#f5b76b]/35"
      />
    </label>
  );
}
