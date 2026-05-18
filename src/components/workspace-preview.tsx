import { MapPin, Move3D, Waves } from "lucide-react";
import type { RentalProduct } from "@/data/products";

type WorkspacePreviewProps = {
  selectedProducts: RentalProduct[];
};

export function WorkspacePreview({ selectedProducts }: WorkspacePreviewProps) {
  return (
    <section className="relative min-h-[620px] overflow-hidden rounded-[2rem] border border-white/70 bg-[#fffaf0] shadow-[0_18px_70px_rgba(77,55,35,0.14)]">
      <div className="absolute inset-x-0 top-0 h-44 bg-[linear-gradient(180deg,#77c8ce_0%,#d5f1ec_100%)]" />
      <div className="absolute inset-x-0 top-32 h-24 bg-[#f0c77b]" />
      <div className="absolute inset-x-0 bottom-0 h-[68%] bg-[linear-gradient(160deg,#cf8b47_0%,#f3bf6b_42%,#e8a45b_100%)]" />
      <div className="absolute left-[6%] top-14 h-20 w-20 rounded-full bg-[#f8d267] shadow-[0_0_60px_rgba(248,210,103,0.8)]" />
      <div className="absolute right-[8%] top-20 flex gap-2 text-[#2f7d88]">
        <Waves className="size-9" />
        <Waves className="size-9 translate-y-3" />
        <Waves className="size-9" />
      </div>

      <div className="relative z-10 flex h-full min-h-[620px] flex-col justify-between p-4 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="rounded-full bg-white/80 px-4 py-2 text-sm font-black shadow-lg backdrop-blur">
            Canggu studio setup
          </div>
          <div className="flex items-center gap-2 rounded-full bg-[#201b18] px-4 py-2 text-sm font-bold text-white shadow-lg">
            <MapPin className="size-4 text-[#f5b76b]" />
            Bali delivery
          </div>
        </div>

        <div className="relative mx-auto flex h-[420px] w-full max-w-2xl items-end justify-center">
          <div className="absolute bottom-8 h-36 w-[78%] max-w-[520px] rounded-[50%] bg-[#6e4c37]/22 blur-sm" />
          <div className="absolute bottom-24 h-8 w-[68%] max-w-[460px] rounded-full bg-[#8d5836]" />
          <div className="absolute bottom-24 h-28 w-4 -translate-x-48 rounded-full bg-[#70422d]" />
          <div className="absolute bottom-24 h-28 w-4 translate-x-48 rounded-full bg-[#70422d]" />
          <div className="absolute bottom-48 h-5 w-[72%] max-w-[500px] rounded-full bg-[#dda35d] shadow-2xl" />

          {selectedProducts.map((product, index) => {
            const Icon = product.icon;
            const positions = [
              "bottom-[210px] left-[18%]",
              "bottom-[92px] right-[18%]",
              "bottom-[238px] left-[42%]",
              "bottom-[262px] right-[20%]",
              "bottom-[190px] right-[38%]",
              "bottom-[116px] left-[10%]",
              "bottom-[300px] left-[8%]",
              "bottom-[320px] right-[8%]",
            ];

            return (
              <div
                key={product.id}
                className={`absolute ${positions[index % positions.length]} group`}
              >
                <div
                  className={`grid size-16 place-items-center rounded-[1.35rem] bg-gradient-to-br ${product.accent} shadow-[0_18px_35px_rgba(48,35,24,0.28)] ring-4 ring-white/45 transition duration-300 group-hover:-translate-y-2 sm:size-20`}
                >
                  <Icon className="size-7 text-white sm:size-9" />
                </div>
              </div>
            );
          })}

          <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-white/84 px-4 py-2 text-sm font-black text-[#4c3c31] shadow-lg backdrop-blur">
            <Move3D className="size-4 text-[#d78f43]" />
            Live visual mockup
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {["Quiet focus", "Video-call ready", "Flexible weekly rent"].map((item) => (
            <div key={item} className="rounded-3xl bg-white/72 px-4 py-3 text-sm font-black shadow-lg backdrop-blur">
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
