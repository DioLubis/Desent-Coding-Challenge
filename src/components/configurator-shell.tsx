"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import { ArrowDown, CalendarDays, MapPin, PackageCheck, UsersRound } from "lucide-react";
import { ProductSelection } from "@/components/product-selection";
import { SummaryCheckout } from "@/components/summary-checkout";
import { WorkspacePreview } from "@/components/workspace-preview";
import {
  accessories,
  calculateTotalMonthlyPrice,
  chairs,
  defaultConfiguratorSelections,
  desks,
  findAccessory,
  findChair,
  findDesk,
  type ConfiguratorState,
} from "@/data/products";

export function ConfiguratorShell() {
  const [configuratorState, setConfiguratorState] = useState<ConfiguratorState>(() => ({
    ...defaultConfiguratorSelections,
    totalMonthlyPrice: calculateTotalMonthlyPrice(
      defaultConfiguratorSelections.selectedDesk,
      defaultConfiguratorSelections.selectedChair,
      defaultConfiguratorSelections.selectedAccessories,
    ),
  }));

  const selectedDesk = useMemo(
    () => findDesk(configuratorState.selectedDesk),
    [configuratorState.selectedDesk],
  );

  const selectedChair = useMemo(
    () => findChair(configuratorState.selectedChair),
    [configuratorState.selectedChair],
  );

  const selectedAccessories = useMemo(
    () =>
      configuratorState.selectedAccessories
        .map((selectedAccessory) => {
          const accessory = findAccessory(selectedAccessory.id);

          return accessory ? { accessory, quantity: selectedAccessory.quantity } : null;
        })
        .filter((item) => item !== null),
    [configuratorState.selectedAccessories],
  );

  const updateSelections = (
    updates: Partial<Omit<ConfiguratorState, "totalMonthlyPrice">>,
  ) => {
    setConfiguratorState((current) => {
      const next = {
        selectedDesk: updates.selectedDesk ?? current.selectedDesk,
        selectedChair: updates.selectedChair ?? current.selectedChair,
        selectedAccessories: updates.selectedAccessories ?? current.selectedAccessories,
      };

      return {
        ...next,
        totalMonthlyPrice: calculateTotalMonthlyPrice(
          next.selectedDesk,
          next.selectedChair,
          next.selectedAccessories,
        ),
      };
    });
  };

  const toggleAccessory = (id: string) => {
    setConfiguratorState((current) => {
      const isSelected = current.selectedAccessories.some((item) => item.id === id);
      const selectedAccessories = isSelected
        ? current.selectedAccessories.filter((item) => item.id !== id)
        : [...current.selectedAccessories, { id, quantity: 1 }];

      return {
        ...current,
        selectedAccessories,
        totalMonthlyPrice: calculateTotalMonthlyPrice(
          current.selectedDesk,
          current.selectedChair,
          selectedAccessories,
        ),
      };
    });
  };

  const updateAccessoryQuantity = (id: string, quantity: number) => {
    const accessory = accessories.find((item) => item.id === id);
    const maxQuantity = accessory?.maxQuantity ?? 1;
    const safeQuantity = Math.max(0, Math.min(quantity, maxQuantity));

    setConfiguratorState((current) => {
      const hasAccessory = current.selectedAccessories.some((item) => item.id === id);
      const selectedAccessories =
        safeQuantity === 0
          ? current.selectedAccessories.filter((item) => item.id !== id)
          : hasAccessory
            ? current.selectedAccessories.map((item) =>
                item.id === id ? { ...item, quantity: safeQuantity } : item,
              )
            : [...current.selectedAccessories, { id, quantity: safeQuantity }];

      return {
        ...current,
        selectedAccessories,
        totalMonthlyPrice: calculateTotalMonthlyPrice(
          current.selectedDesk,
          current.selectedChair,
          selectedAccessories,
        ),
      };
    });
  };

  const selectedItemCount =
    (configuratorState.selectedDesk ? 1 : 0) +
    (configuratorState.selectedChair ? 1 : 0) +
    configuratorState.selectedAccessories.reduce(
      (total, selectedAccessory) => total + selectedAccessory.quantity,
      0,
    );

  return (
    <main className="min-h-screen overflow-hidden bg-[#f7f1e8] text-[#201b18]">
      <section className="relative isolate min-h-[92vh] px-4 py-5 sm:px-6 lg:px-8">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_18%_12%,rgba(255,183,94,0.5),transparent_28%),radial-gradient(circle_at_82%_18%,rgba(80,173,180,0.3),transparent_26%),linear-gradient(135deg,#fff7e9_0%,#f6ecdf_55%,#e6f2ef_100%)]" />
        <div className="absolute bottom-0 left-0 right-0 -z-10 h-[46%] bg-[linear-gradient(160deg,#d89a52_0%,#f3bf6b_45%,#e5a359_100%)]" />
        <div className="mx-auto flex min-h-[86vh] max-w-7xl flex-col">
          <nav className="flex items-center justify-between py-2">
            <p className="text-sm font-black uppercase tracking-[0.2em] text-[#b45f32]">
              monis.rent
            </p>
            <a
              href="#checkout"
              className="rounded-full bg-[#201b18] px-4 py-2 text-sm font-black text-white shadow-lg transition hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f06f61]"
            >
              Rent request
            </a>
          </nav>

          <div className="grid flex-1 items-center gap-8 py-8 sm:gap-10 sm:py-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1fr)]">
            <div className="relative z-10 max-w-3xl">
              <p className="mb-4 inline-flex rounded-full bg-white/65 px-4 py-2 text-sm font-black text-[#245b61] shadow-sm backdrop-blur">
                Workspace rentals for Bali builders
              </p>
              <h1 className="text-4xl font-black leading-[0.94] tracking-tight text-[#1d1a16] sm:text-7xl lg:text-8xl">
                Design Your Bali Workspace
              </h1>
              <p className="mt-6 max-w-2xl text-lg font-medium leading-8 text-[#5f5148] sm:text-xl">
                Rent desks, chairs, monitors, and workspace accessories without buying
                furniture. Build a setup for your villa, studio, or startup space and request
                delivery in Bali.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a
                  href="#configurator"
                  className="inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[#f06f61] px-7 text-sm font-black text-white shadow-xl shadow-[#f06f61]/25 transition hover:-translate-y-0.5 hover:bg-[#df5f52] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#201b18]"
                >
                  Start Building
                  <ArrowDown className="size-4" />
                </a>
                <span className="text-sm font-bold text-[#6c5e53]">
                  Flexible monthly rental, delivered in Bali.
                </span>
              </div>
            </div>

            <div className="relative mx-auto min-h-[340px] w-full max-w-[620px] sm:min-h-[420px] lg:max-w-none">
              <div className="absolute left-1/2 top-20 h-8 w-[72%] -translate-x-1/2 rounded-full bg-[#8d5836] shadow-2xl" />
              <div className="absolute left-[18%] top-28 h-32 w-4 rounded-full bg-[#70422d]" />
              <div className="absolute right-[18%] top-28 h-32 w-4 rounded-full bg-[#70422d]" />
              <div className="absolute left-1/2 top-11 h-14 w-[78%] -translate-x-1/2 rounded-[1.6rem] bg-gradient-to-r from-[#d79248] via-[#e7ad66] to-[#c87836] shadow-[0_30px_80px_rgba(77,45,24,0.28)] ring-4 ring-white/45" />
              <div className="absolute left-[36%] top-0 grid size-20 place-items-center rounded-[1.5rem] bg-gradient-to-br from-[#6c6b7d] to-[#252431] text-white shadow-2xl ring-4 ring-white/55">
                <span className="h-8 w-11 rounded-md border-4 border-white/85" />
              </div>
              <div className="absolute right-[22%] top-7 grid size-16 place-items-center rounded-[1.4rem] bg-gradient-to-br from-[#ffd36b] to-[#e1922f] text-white shadow-2xl ring-4 ring-white/55">
                <span className="h-8 w-4 rounded-full bg-white/80" />
              </div>
              <div className="absolute left-[18%] top-24 grid size-16 place-items-center rounded-[1.4rem] bg-gradient-to-br from-[#86c987] to-[#367a4c] text-white shadow-2xl ring-4 ring-white/55">
                <span className="size-8 rounded-full bg-white/75" />
              </div>
              <div className="absolute bottom-12 left-1/2 flex -translate-x-1/2 flex-col items-center">
                <div className="h-24 w-28 rounded-[2rem_2rem_1.4rem_1.4rem] bg-gradient-to-br from-[#76b5bd] to-[#2c6d79] shadow-[0_22px_60px_rgba(32,27,24,0.24)] ring-4 ring-white/50 sm:h-28 sm:w-32" />
                <div className="-mt-4 h-16 w-24 rounded-[1.7rem] bg-gradient-to-br from-[#76b5bd] to-[#2c6d79] shadow-lg" />
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
            title="Choose the pieces that match how you work."
            copy="Start with the furniture, then layer in practical comforts like monitors, lighting, storage, plants, and coffee."
          />
          <div className="mt-6">
            <ProductSelection
              state={configuratorState}
              desks={desks}
              chairs={chairs}
              accessories={accessories}
              selectedItemCount={selectedItemCount}
              onSelectDesk={(selectedDesk) => updateSelections({ selectedDesk })}
              onSelectChair={(selectedChair) => updateSelections({ selectedChair })}
              onToggleAccessory={toggleAccessory}
              onUpdateAccessoryQuantity={updateAccessoryQuantity}
            />
          </div>
        </div>
      </section>

      <section id="preview" className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="Workspace preview"
            title="Watch your rental setup come together."
            copy="The preview updates as you choose furniture and accessories, so the workspace feels designed before it is delivered."
          />
          <div className="mt-6">
            <WorkspacePreview
              selectedDesk={selectedDesk}
              selectedChair={selectedChair}
              selectedAccessories={selectedAccessories}
            />
          </div>
        </div>
      </section>

      <section id="checkout" className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[minmax(0,0.8fr)_minmax(360px,520px)] lg:items-start">
          <div className="rounded-[2rem] bg-white/60 p-5 shadow-[0_18px_70px_rgba(77,55,35,0.1)] backdrop-blur">
            <SectionIntro
              eyebrow="Rent request"
              title="Confirm the setup, then send the request."
              copy="No complicated checkout. Share your contact, rental duration, and preferred delivery date so the monis.rent team can prepare the next step."
            />
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {["Pick gear", "Preview setup", "Request rental"].map((step, index) => (
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
            selectedDesk={selectedDesk}
            selectedChair={selectedChair}
            selectedAccessories={selectedAccessories}
          />
        </div>
      </section>

      <section className="px-4 pb-16 pt-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <SectionIntro
            eyebrow="Why rent"
            title="Built for temporary homes, focused sprints, and fast-moving teams."
            copy="A cleaner way to set up a productive Bali workspace without buying, storing, or moving office equipment."
          />
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <BenefitCard
              icon={<CalendarDays className="size-5" />}
              title="Flexible monthly rental"
              copy="Scale the setup up or down as your stay or team changes."
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
              copy="Avoid one-off purchases, storage problems, and furniture resale."
            />
          </div>
        </div>
      </section>
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
