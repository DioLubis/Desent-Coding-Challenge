import { Check, Plus } from "lucide-react";
import { rentalProducts, type ProductCategory } from "@/data/products";

type ProductSelectionProps = {
  selectedIds: string[];
  onToggle: (id: string) => void;
};

const categories: ProductCategory[] = ["Core", "Focus", "Atmosphere"];

export function ProductSelection({ selectedIds, onToggle }: ProductSelectionProps) {
  return (
    <aside className="rounded-[2rem] border border-white/70 bg-white/72 p-4 shadow-[0_18px_70px_rgba(77,55,35,0.12)] backdrop-blur">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#b45f32]">Gear</p>
          <h2 className="mt-1 text-2xl font-black tracking-tight">Pick the pieces</h2>
        </div>
        <span className="rounded-full bg-[#e2f2ef] px-3 py-1 text-sm font-bold text-[#245b61]">
          {selectedIds.length} active
        </span>
      </div>

      <div className="space-y-5">
        {categories.map((category) => (
          <section key={category}>
            <h3 className="mb-2 text-xs font-black uppercase tracking-[0.16em] text-[#78695d]">
              {category}
            </h3>
            <div className="space-y-2">
              {rentalProducts
                .filter((product) => product.category === category)
                .map((product) => {
                  const Icon = product.icon;
                  const isSelected = selectedIds.includes(product.id);

                  return (
                    <button
                      key={product.id}
                      type="button"
                      onClick={() => onToggle(product.id)}
                      className={`group flex w-full items-center gap-3 rounded-3xl border p-3 text-left transition duration-200 ${
                        isSelected
                          ? "border-[#201b18] bg-[#201b18] text-white shadow-xl shadow-[#201b18]/15"
                          : "border-[#eadfce] bg-white/80 hover:-translate-y-0.5 hover:border-[#d78f43]"
                      }`}
                    >
                      <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${product.color}`}>
                        <Icon className="size-5 text-white" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-black">{product.name}</span>
                        <span
                          className={`mt-1 line-clamp-2 text-xs leading-5 ${
                            isSelected ? "text-white/68" : "text-[#6c5e53]"
                          }`}
                        >
                          {product.description}
                        </span>
                      </span>
                      <span
                        className={`grid size-8 shrink-0 place-items-center rounded-full ${
                          isSelected ? "bg-[#f5b76b] text-[#201b18]" : "bg-[#f6ecdf] text-[#8b6c4d]"
                        }`}
                        aria-hidden="true"
                      >
                        {isSelected ? <Check className="size-4" /> : <Plus className="size-4" />}
                      </span>
                    </button>
                  );
                })}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
}
