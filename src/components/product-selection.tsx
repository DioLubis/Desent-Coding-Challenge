import { Check, Minus, Plus } from "lucide-react";
import {
  formatIdr,
  type Accessory,
  type Chair,
  type ConfiguratorState,
  type Desk,
} from "@/data/products";

type ProductSelectionProps = {
  state: ConfiguratorState;
  desks: Desk[];
  chairs: Chair[];
  accessories: Accessory[];
  selectedItemCount: number;
  onSelectDesk: (id: string) => void;
  onSelectChair: (id: string) => void;
  onToggleAccessory: (id: string) => void;
  onUpdateAccessoryQuantity: (id: string, quantity: number) => void;
};

type AccessoryCardProps = {
  accessory: Accessory;
  quantity: number;
  onToggle: () => void;
  onDecrease: () => void;
  onIncrease: () => void;
};

type FurnitureCardProps = {
  item: Desk | Chair;
  isSelected: boolean;
  onClick: () => void;
};

function FurnitureSilhouette({ item, isSelected }: { item: Desk | Chair; isSelected: boolean }) {
  const Icon = item.visual.icon;

  if (item.category === "desk") {
    return (
      <div className="relative h-24 overflow-hidden rounded-3xl bg-[#fff7e9]">
        <div className={`absolute inset-x-5 top-10 h-5 rounded-full bg-gradient-to-r ${item.visual.accent} shadow-lg`} />
        <div className={`absolute left-10 top-14 h-14 w-2 rounded-full ${item.visual.color}`} />
        <div className={`absolute right-10 top-14 h-14 w-2 rounded-full ${item.visual.color}`} />
        <div className="absolute left-7 top-7 h-2 w-16 rounded-full bg-white/70" />
        <div className="absolute right-7 top-7 h-2 w-9 rounded-full bg-white/70" />
        <div
          className={`absolute right-4 top-4 grid size-9 place-items-center rounded-2xl ${
            isSelected ? "bg-[#201b18] text-[#f5b76b]" : "bg-white text-[#8b6c4d]"
          } shadow-md`}
        >
          <Icon className="size-4" />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-24 overflow-hidden rounded-3xl bg-[#fff7e9]">
      <div className={`absolute left-1/2 top-5 h-14 w-20 -translate-x-1/2 rounded-[1.6rem_1.6rem_1rem_1rem] bg-gradient-to-br ${item.visual.accent} shadow-lg`} />
      <div className={`absolute left-1/2 top-14 h-10 w-24 -translate-x-1/2 rounded-[1.4rem] bg-gradient-to-br ${item.visual.accent} shadow-md`} />
      <div className={`absolute left-1/2 top-[5.35rem] h-8 w-2 -translate-x-1/2 ${item.visual.color}`} />
      <div className={`absolute bottom-2 left-1/2 h-2 w-24 -translate-x-1/2 rounded-full ${item.visual.color}`} />
      <div
        className={`absolute right-4 top-4 grid size-9 place-items-center rounded-2xl ${
          isSelected ? "bg-[#201b18] text-[#f5b76b]" : "bg-white text-[#8b6c4d]"
        } shadow-md`}
      >
        <Icon className="size-4" />
      </div>
    </div>
  );
}

function FurnitureCard({ item, isSelected, onClick }: FurnitureCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={isSelected}
      className={`group rounded-[1.6rem] border p-2 text-left transition duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f06f61] ${
        isSelected
          ? "border-[#201b18] bg-[#201b18] text-white shadow-xl shadow-[#201b18]/15 ring-2 ring-[#f5b76b]/45"
          : "border-[#eadfce] bg-white/82 hover:-translate-y-0.5 hover:border-[#d78f43] hover:shadow-lg"
      }`}
    >
      <div aria-hidden="true">
        <FurnitureSilhouette item={item} isSelected={isSelected} />
      </div>
      <div className="px-2 pb-2 pt-3">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h4 className="text-sm font-black leading-5">{item.name}</h4>
            {item.tag ? (
              <span
                className={`mt-2 inline-flex rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                  isSelected ? "bg-white/14 text-[#f5b76b]" : "bg-[#e2f2ef] text-[#245b61]"
                }`}
              >
                {item.tag}
              </span>
            ) : null}
            {isSelected ? (
              <span className="mt-2 ml-1 inline-flex rounded-full bg-[#f5b76b] px-2 py-0.5 text-[10px] font-black uppercase text-[#201b18]">
                Selected
              </span>
            ) : null}
          </div>
          <span
            className={`grid size-8 shrink-0 place-items-center rounded-full ${
              isSelected ? "bg-[#f5b76b] text-[#201b18]" : "bg-[#f6ecdf] text-[#8b6c4d]"
            }`}
            aria-hidden="true"
          >
            {isSelected ? <Check className="size-4" /> : <Plus className="size-4" />}
          </span>
        </div>
        <p className={`mt-3 line-clamp-2 min-h-10 text-xs leading-5 ${isSelected ? "text-white/68" : "text-[#6c5e53]"}`}>
          {item.description}
        </p>
        <p className={`mt-3 text-sm font-black ${isSelected ? "text-[#f5b76b]" : "text-[#b45f32]"}`}>
          {formatIdr(item.pricePerMonth)}/mo
        </p>
      </div>
    </button>
  );
}

function accessoryActionLabel(accessory: Accessory) {
  if (accessory.id.includes("monitor")) return "Add Monitor";
  if (accessory.id.includes("lamp")) return "Add Lamp";
  if (accessory.id.includes("plant")) return "Add Plant";
  if (accessory.id.includes("coffee")) return "Add Coffee";
  if (accessory.id.includes("shelf")) return "Add Shelf";

  return "Add Board";
}

function AccessoryCard({
  accessory,
  quantity,
  onToggle,
  onDecrease,
  onIncrease,
}: AccessoryCardProps) {
  const Icon = accessory.visual.icon;
  const isSelected = quantity > 0;
  const canAdjustQuantity = accessory.quantityAdjustable;
  const maxQuantity = accessory.maxQuantity ?? 1;

  return (
    <article
      className={`group rounded-[1.6rem] border p-3 transition duration-200 ${
        isSelected
          ? "accessory-added border-[#201b18] bg-[#201b18] text-white shadow-xl shadow-[#201b18]/15 ring-2 ring-[#f5b76b]/45"
          : "border-[#eadfce] bg-white/82 hover:-translate-y-0.5 hover:border-[#d78f43] hover:shadow-lg"
      }`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`relative grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${accessory.visual.accent} shadow-md`}
          aria-hidden="true"
        >
          <Icon className="size-6 text-white" />
          {isSelected ? (
            <span className="absolute -right-1 -top-1 grid size-5 place-items-center rounded-full bg-[#f5b76b] text-[#201b18]">
              <Check className="size-3" />
            </span>
          ) : null}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h4 className="text-sm font-black leading-5">{accessory.name}</h4>
            {accessory.tag ? (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                  isSelected ? "bg-white/14 text-[#f5b76b]" : "bg-[#e2f2ef] text-[#245b61]"
                }`}
              >
                {accessory.tag}
              </span>
            ) : null}
            {isSelected ? (
              <span className="rounded-full bg-[#f5b76b] px-2 py-0.5 text-[10px] font-black uppercase text-[#201b18]">
                Selected
              </span>
            ) : null}
          </div>
          <p className={`mt-1 line-clamp-2 text-xs leading-5 ${isSelected ? "text-white/68" : "text-[#6c5e53]"}`}>
            {accessory.description}
          </p>
          <p className={`mt-2 text-xs font-black ${isSelected ? "text-[#f5b76b]" : "text-[#b45f32]"}`}>
            {formatIdr(accessory.pricePerMonth)}/mo
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        {canAdjustQuantity && isSelected ? (
          <div className="flex items-center gap-1 rounded-full bg-white/12 p-1">
            <button
              type="button"
              aria-label={`Decrease ${accessory.name}`}
              onClick={onDecrease}
              className="grid size-9 place-items-center rounded-full bg-white/12 text-white transition hover:bg-white/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5b76b]"
            >
              <Minus className="size-4" />
            </button>
            <span className="w-16 text-center text-xs font-black" aria-live="polite">
              {quantity}/{maxQuantity}
            </span>
            <button
              type="button"
              aria-label={`Increase ${accessory.name}`}
              onClick={onIncrease}
              disabled={quantity >= maxQuantity}
              className="grid size-9 place-items-center rounded-full bg-[#f5b76b] text-[#201b18] transition hover:bg-[#ffd07a] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Plus className="size-4" />
            </button>
          </div>
        ) : (
          <span className={`text-xs font-bold ${isSelected ? "text-white/55" : "text-[#7b6b5e]"}`}>
            {isSelected ? "Added to scene" : "Customize the setup"}
          </span>
        )}

        <button
          type="button"
          onClick={onToggle}
          aria-pressed={isSelected}
          className={`h-11 shrink-0 rounded-full px-4 text-xs font-black transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${
            isSelected
              ? "bg-white/12 text-white hover:bg-white/20 focus-visible:outline-[#f5b76b]"
              : "bg-[#201b18] text-white hover:-translate-y-0.5 hover:bg-[#3a302a] focus-visible:outline-[#f06f61]"
          }`}
        >
          {isSelected ? "Remove" : accessoryActionLabel(accessory)}
        </button>
      </div>
    </article>
  );
}

export function ProductSelection({
  state,
  desks,
  chairs,
  accessories,
  selectedItemCount,
  onSelectDesk,
  onSelectChair,
  onToggleAccessory,
  onUpdateAccessoryQuantity,
}: ProductSelectionProps) {
  const getAccessoryQuantity = (id: string) =>
    state.selectedAccessories.find((item) => item.id === id)?.quantity ?? 0;

  return (
    <section
      aria-labelledby="product-selection-title"
      className="rounded-[1.75rem] border border-white/70 bg-white/72 p-4 shadow-[0_18px_70px_rgba(77,55,35,0.12)] backdrop-blur sm:rounded-[2rem] sm:p-5 lg:p-6"
    >
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#b45f32]">Gear</p>
          <h2 id="product-selection-title" className="mt-1 text-2xl font-black tracking-tight">
            Pick the pieces
          </h2>
        </div>
        <span className="rounded-full bg-[#e2f2ef] px-3 py-1 text-sm font-bold text-[#245b61]">
          {selectedItemCount} items
        </span>
      </div>

      <div className="space-y-6">
        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.16em] text-[#78695d]">
                Desk
              </h3>
              <p className="mt-1 text-xs leading-5 text-[#7b6b5e]">Choose the anchor of the setup.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {desks.map((desk) => (
              <FurnitureCard
                key={desk.id}
                item={desk}
                isSelected={state.selectedDesk === desk.id}
                onClick={() => onSelectDesk(desk.id)}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.16em] text-[#78695d]">
                Chair
              </h3>
              <p className="mt-1 text-xs leading-5 text-[#7b6b5e]">Set the comfort and posture style.</p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {chairs.map((chair) => (
              <FurnitureCard
                key={chair.id}
                item={chair}
                isSelected={state.selectedChair === chair.id}
                onClick={() => onSelectChair(chair.id)}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-end justify-between gap-3">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.16em] text-[#78695d]">
                Accessories
              </h3>
              <p className="mt-1 text-xs leading-5 text-[#7b6b5e]">
                Add personality and utility to the scene.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {accessories.map((accessory) => {
              const quantity = getAccessoryQuantity(accessory.id);

              return (
                <AccessoryCard
                  key={accessory.id}
                  accessory={accessory}
                  quantity={quantity}
                  onToggle={() => onToggleAccessory(accessory.id)}
                  onDecrease={() => onUpdateAccessoryQuantity(accessory.id, quantity - 1)}
                  onIncrease={() => onUpdateAccessoryQuantity(accessory.id, quantity + 1)}
                />
              );
            })}
          </div>
        </section>
      </div>
    </section>
  );
}
