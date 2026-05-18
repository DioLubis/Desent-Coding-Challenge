import { Check, MapPin, Move3D, Sparkles, Waves } from "lucide-react";
import type { Accessory, Chair, Desk } from "@/data/products";

type WorkspacePreviewProps = {
  selectedDesk?: Desk;
  selectedChair?: Chair;
  selectedAccessories: Array<{ accessory: Accessory; quantity: number }>;
};

const deskStyles: Record<string, { top: string; legs: string; width: string; label: string }> = {
  "bamboo-standing-desk": {
    top: "bg-gradient-to-r from-[#d79248] via-[#e7ad66] to-[#c87836]",
    legs: "bg-[#8e552e]",
    width: "w-[76%]",
    label: "Bamboo warmth",
  },
  "compact-focus-desk": {
    top: "bg-gradient-to-r from-[#4d9acb] via-[#73bddc] to-[#3e83b5]",
    legs: "bg-[#2e5f78]",
    width: "w-[58%]",
    label: "Compact mode",
  },
  "founder-studio-desk": {
    top: "bg-gradient-to-r from-[#35323d] via-[#595563] to-[#252431]",
    legs: "bg-[#201f27]",
    width: "w-[84%]",
    label: "Studio width",
  },
};

const chairStyles: Record<string, { shell: string; base: string; label: string }> = {
  "ergo-cloud-chair": {
    shell: "bg-gradient-to-br from-[#76b5bd] to-[#2c6d79]",
    base: "bg-[#244f57]",
    label: "Ergo support",
  },
  "rattan-lounge-chair": {
    shell: "bg-gradient-to-br from-[#d99a5d] to-[#8e552e]",
    base: "bg-[#7b4c2d]",
    label: "Rattan texture",
  },
  "task-pro-chair": {
    shell: "bg-gradient-to-br from-[#6d7685] to-[#1f252d]",
    base: "bg-[#161b22]",
    label: "Task posture",
  },
};

const accessorySlots: Record<string, string[]> = {
  "creator-monitor": [
    "left-[42%] top-[31%]",
    "left-[54%] top-[33%] scale-90",
  ],
  "sunset-task-lamp": [
    "right-[21%] top-[28%]",
    "left-[23%] top-[29%]",
    "right-[34%] top-[24%] scale-90",
  ],
  "tropical-plant": [
    "left-[21%] top-[36%]",
    "right-[18%] top-[41%] scale-90",
    "left-[14%] top-[52%] scale-75",
    "right-[10%] top-[54%] scale-75",
  ],
  "coffee-machine": ["right-[15%] top-[43%]"],
  "open-shelf": ["left-[8%] top-[25%]"],
  "planning-board": ["right-[9%] top-[18%]"],
};

function AccessoryVisual({
  accessory,
  index,
}: {
  accessory: Accessory;
  index: number;
}) {
  const Icon = accessory.visual.icon;
  const slots = accessorySlots[accessory.id] ?? ["left-[48%] top-[42%]"];
  const slot = slots[index % slots.length];

  return (
    <div
      className={`workspace-pop absolute ${slot} z-30 transition duration-300 hover:-translate-y-2`}
    >
      <div
        className={`relative grid size-11 place-items-center rounded-2xl bg-gradient-to-br ${accessory.visual.accent} shadow-[0_16px_36px_rgba(35,24,18,0.28)] ring-4 ring-white/55 sm:size-16`}
      >
        <Icon className="size-5 text-white sm:size-7" />
        <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-[#201b18] text-[10px] font-black text-[#f5b76b]">
          <Check className="size-3" />
        </span>
      </div>
    </div>
  );
}

export function WorkspacePreview({
  selectedDesk,
  selectedChair,
  selectedAccessories,
}: WorkspacePreviewProps) {
  const hasStarted = Boolean(selectedDesk || selectedChair || selectedAccessories.length);
  const deskStyle = selectedDesk ? deskStyles[selectedDesk.id] : undefined;
  const chairStyle = selectedChair ? chairStyles[selectedChair.id] : undefined;
  const accessoryInstances = selectedAccessories.flatMap(({ accessory, quantity }) =>
    Array.from({ length: quantity }, (_, index) => ({ accessory, index })),
  );

  return (
    <section className="relative min-h-[540px] overflow-hidden rounded-[1.75rem] border border-white/70 bg-[#fffaf0] shadow-[0_18px_70px_rgba(77,55,35,0.14)] sm:min-h-[640px] sm:rounded-[2rem]">
      <div className="absolute inset-x-0 top-0 h-44 bg-[linear-gradient(180deg,#77c8ce_0%,#d5f1ec_100%)]" />
      <div className="absolute inset-x-0 top-32 h-24 bg-[#f0c77b]" />
      <div className="absolute inset-x-0 bottom-0 h-[68%] bg-[linear-gradient(160deg,#cf8b47_0%,#f3bf6b_42%,#e8a45b_100%)]" />
      <div className="absolute left-[6%] top-14 h-20 w-20 rounded-full bg-[#f8d267] shadow-[0_0_60px_rgba(248,210,103,0.8)]" />
      <div className="absolute right-[8%] top-20 flex gap-2 text-[#2f7d88]">
        <Waves className="size-9" />
        <Waves className="size-9 translate-y-3" />
        <Waves className="size-9" />
      </div>

      <div className="relative z-10 flex h-full min-h-[540px] flex-col justify-between p-4 sm:min-h-[640px] sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-black shadow-lg backdrop-blur">
            Canggu studio setup
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#201b18] px-4 py-2 text-sm font-bold text-white shadow-lg">
            <MapPin className="size-4 text-[#f5b76b]" />
            Bali delivery
          </div>
        </div>

        <div className="relative mx-auto h-[350px] w-full max-w-3xl sm:h-[460px]">
          <div className="absolute bottom-8 left-1/2 h-36 w-[82%] max-w-[560px] -translate-x-1/2 rounded-[50%] bg-[#6e4c37]/22 blur-sm" />

          {!hasStarted ? (
            <div className="absolute inset-x-2 top-12 z-20 mx-auto flex max-w-md flex-col items-center rounded-[1.5rem] border border-white/80 bg-white/72 px-5 py-6 text-center shadow-2xl backdrop-blur sm:inset-x-4 sm:top-20 sm:rounded-[2rem] sm:px-6 sm:py-8">
              <div className="mb-4 grid size-14 place-items-center rounded-3xl bg-[#201b18] text-[#f5b76b] shadow-xl sm:mb-5 sm:size-16">
                <Sparkles className="size-7 sm:size-8" />
              </div>
              <h3 className="text-xl font-black tracking-tight sm:text-2xl">Start with a desk</h3>
              <p className="mt-2 text-sm leading-6 text-[#6c5e53]">
                Choose a desk and chair, then layer in monitors, plants, lighting, coffee, and storage.
              </p>
            </div>
          ) : null}

          <div
            className={`absolute left-1/2 top-[45%] z-10 h-4 -translate-x-1/2 rounded-full bg-white/45 transition-all duration-500 ${
              selectedDesk ? "w-[72%] opacity-100" : "w-[42%] opacity-40"
            }`}
          />

          {selectedDesk && deskStyle ? (
            <div className="workspace-pop absolute inset-x-0 top-[40%] z-20 flex flex-col items-center">
              <div className={`relative h-10 ${deskStyle.width} rounded-[1.35rem] ${deskStyle.top} shadow-[0_22px_45px_rgba(77,45,24,0.28)] ring-4 ring-white/45 transition-all duration-500 sm:h-12`}>
                <div className="absolute left-8 top-3 h-2 w-20 rounded-full bg-white/24" />
                <div className="absolute right-8 top-3 h-2 w-12 rounded-full bg-white/24" />
              </div>
              <div className={`mt-[-2px] flex ${deskStyle.width} justify-between px-[12%]`}>
                <div className={`h-24 w-3 rounded-b-full ${deskStyle.legs} sm:h-32 sm:w-4`} />
                <div className={`h-24 w-3 rounded-b-full ${deskStyle.legs} sm:h-32 sm:w-4`} />
              </div>
            </div>
          ) : (
            <div className="absolute inset-x-0 top-[42%] z-10 flex flex-col items-center opacity-45">
              <div className="h-9 w-[64%] rounded-[1.35rem] border-2 border-dashed border-[#8b6c4d]/55 sm:h-10" />
              <div className="mt-2 flex w-[52%] justify-between px-[12%]">
                <div className="h-20 w-3 rounded-b-full border-2 border-dashed border-[#8b6c4d]/45 sm:h-24" />
                <div className="h-20 w-3 rounded-b-full border-2 border-dashed border-[#8b6c4d]/45 sm:h-24" />
              </div>
            </div>
          )}

          {accessoryInstances.map(({ accessory, index }) => (
            <AccessoryVisual key={`${accessory.id}-${index}`} accessory={accessory} index={index} />
          ))}

          {selectedChair && chairStyle ? (
            <div className="workspace-pop absolute bottom-12 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center sm:bottom-14">
              <div className={`h-20 w-24 rounded-[2rem_2rem_1.4rem_1.4rem] ${chairStyle.shell} shadow-[0_18px_40px_rgba(32,27,24,0.28)] ring-4 ring-white/50 sm:h-28 sm:w-32`}>
                <div className="mx-auto mt-4 h-2 w-14 rounded-full bg-white/25" />
              </div>
              <div className={`-mt-4 h-14 w-20 rounded-[1.7rem] ${chairStyle.shell} shadow-lg sm:h-16 sm:w-24`} />
              <div className={`h-10 w-3 ${chairStyle.base} sm:h-12`} />
              <div className={`h-3 w-24 rounded-full ${chairStyle.base} sm:w-28`} />
            </div>
          ) : (
            <div className="absolute bottom-14 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center opacity-40 sm:bottom-16">
              <div className="h-20 w-24 rounded-[2rem_2rem_1.4rem_1.4rem] border-2 border-dashed border-[#8b6c4d]/55 sm:h-24 sm:w-28" />
              <div className="-mt-4 h-12 w-20 rounded-[1.7rem] border-2 border-dashed border-[#8b6c4d]/45 sm:h-14 sm:w-24" />
            </div>
          )}

          <div className="absolute bottom-4 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full bg-white/84 px-4 py-2 text-xs font-black text-[#4c3c31] shadow-lg backdrop-blur sm:bottom-5 sm:text-sm">
            <Move3D className="size-4 text-[#d78f43]" />
            Live visual workspace
          </div>
        </div>

        <div className="grid gap-2 sm:grid-cols-3 sm:gap-3">
          {[
            selectedDesk ? selectedDesk.name : "Choose desk",
            selectedChair ? selectedChair.name : "Choose chair",
            `${accessoryInstances.length} accessories`,
          ].map((item) => (
            <div key={item} className="rounded-3xl bg-white/72 px-4 py-3 text-xs font-black shadow-lg backdrop-blur sm:text-sm">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
