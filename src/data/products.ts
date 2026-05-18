import type { LucideIcon } from "lucide-react";
import {
  Armchair,
  BookOpen,
  Coffee,
  LampDesk,
  Leaf,
  Monitor,
  PanelsTopLeft,
  Table2,
} from "lucide-react";

export type ProductCategory = "desk" | "chair" | "accessory";

export type ProductTag = "Popular" | "Ergonomic" | "Compact" | "Premium";

export type ConfiguratorItem = {
  id: string;
  name: string;
  category: ProductCategory;
  pricePerMonth: number;
  visual: {
    icon: LucideIcon;
    color: string;
    accent: string;
  };
  description: string;
  tag?: ProductTag;
};

export type Desk = ConfiguratorItem & {
  category: "desk";
};

export type Chair = ConfiguratorItem & {
  category: "chair";
};

export type Accessory = ConfiguratorItem & {
  category: "accessory";
  quantityAdjustable?: boolean;
  maxQuantity?: number;
};

export type SelectedAccessory = {
  id: Accessory["id"];
  quantity: number;
};

export type ConfiguratorState = {
  selectedDesk: Desk["id"] | null;
  selectedChair: Chair["id"] | null;
  selectedAccessories: SelectedAccessory[];
  totalMonthlyPrice: number;
};

export const desks: Desk[] = [
  {
    id: "bamboo-standing-desk",
    name: "Bamboo Standing Desk",
    category: "desk",
    pricePerMonth: 1680000,
    visual: {
      icon: Table2,
      color: "bg-[#d78f43]",
      accent: "from-[#f5b76b] to-[#bc6f2e]",
    },
    description: "Adjustable bamboo desk with a wide surface for laptop, notebook, and coffee.",
    tag: "Popular",
  },
  {
    id: "compact-focus-desk",
    name: "Compact Focus Desk",
    category: "desk",
    pricePerMonth: 1120000,
    visual: {
      icon: PanelsTopLeft,
      color: "bg-[#3f7fbe]",
      accent: "from-[#83c5f4] to-[#2f72b6]",
    },
    description: "Small-footprint desk for apartments, guest rooms, and tight villa corners.",
    tag: "Compact",
  },
  {
    id: "founder-studio-desk",
    name: "Founder Studio Desk",
    category: "desk",
    pricePerMonth: 2100000,
    visual: {
      icon: Table2,
      color: "bg-[#33313f]",
      accent: "from-[#777281] to-[#252431]",
    },
    description: "Premium executive surface with cable tray and room for a full creator setup.",
    tag: "Premium",
  },
];

export const chairs: Chair[] = [
  {
    id: "ergo-cloud-chair",
    name: "Ergo Cloud Chair",
    category: "chair",
    pricePerMonth: 1120000,
    visual: {
      icon: Armchair,
      color: "bg-[#325d66]",
      accent: "from-[#76b5bd] to-[#2c6d79]",
    },
    description: "Breathable ergonomic support for long build days and client calls.",
    tag: "Ergonomic",
  },
  {
    id: "rattan-lounge-chair",
    name: "Rattan Lounge Chair",
    category: "chair",
    pricePerMonth: 780000,
    visual: {
      icon: Armchair,
      color: "bg-[#a86c3d]",
      accent: "from-[#d99a5d] to-[#8e552e]",
    },
    description: "Relaxed Bali texture with a supportive cushion and softer visual presence.",
    tag: "Popular",
  },
  {
    id: "task-pro-chair",
    name: "Task Pro Chair",
    category: "chair",
    pricePerMonth: 1350000,
    visual: {
      icon: Armchair,
      color: "bg-[#22272f]",
      accent: "from-[#6d7685] to-[#1f252d]",
    },
    description: "Premium posture chair with adjustable arms, lumbar support, and headrest.",
    tag: "Premium",
  },
];

export const accessories: Accessory[] = [
  {
    id: "creator-monitor",
    name: "27-inch Creator Monitor",
    category: "accessory",
    pricePerMonth: 1360000,
    visual: {
      icon: Monitor,
      color: "bg-[#33313f]",
      accent: "from-[#6c6b7d] to-[#252431]",
    },
    description: "Sharp external display for design reviews, spreadsheets, and async calls.",
    tag: "Popular",
    quantityAdjustable: true,
    maxQuantity: 2,
  },
  {
    id: "sunset-task-lamp",
    name: "Sunset Task Lamp",
    category: "accessory",
    pricePerMonth: 360000,
    visual: {
      icon: LampDesk,
      color: "bg-[#f2b84b]",
      accent: "from-[#ffd36b] to-[#e1922f]",
    },
    description: "Dimmable amber lamp that keeps the desk warm into the evening.",
    tag: "Compact",
  },
  {
    id: "tropical-plant",
    name: "Tropical Desk Plant",
    category: "accessory",
    pricePerMonth: 220000,
    visual: {
      icon: Leaf,
      color: "bg-[#4a8b62]",
      accent: "from-[#86c987] to-[#367a4c]",
    },
    description: "Low-maintenance greenery to soften the work zone.",
  },
  {
    id: "coffee-machine",
    name: "Countertop Coffee Machine",
    category: "accessory",
    pricePerMonth: 980000,
    visual: {
      icon: Coffee,
      color: "bg-[#7b5140]",
      accent: "from-[#b98568] to-[#694436]",
    },
    description: "Compact espresso setup for villa teams and focused mornings.",
    tag: "Premium",
  },
  {
    id: "open-shelf",
    name: "Open Utility Shelf",
    category: "accessory",
    pricePerMonth: 520000,
    visual: {
      icon: BookOpen,
      color: "bg-[#9b69b6]",
      accent: "from-[#cf9ce6] to-[#8350a2]",
    },
    description: "A clean shelf for books, camera gear, cables, and daily supplies.",
    tag: "Compact",
  },
  {
    id: "planning-board",
    name: "Founder Planning Board",
    category: "accessory",
    pricePerMonth: 440000,
    visual: {
      icon: PanelsTopLeft,
      color: "bg-[#f06f61]",
      accent: "from-[#ff9f8e] to-[#db584d]",
    },
    description: "Portable whiteboard kit for sprint planning and workshop days.",
    tag: "Ergonomic",
  },
];

export const defaultConfiguratorSelections = {
  selectedDesk: null,
  selectedChair: null,
  selectedAccessories: [],
} satisfies Omit<ConfiguratorState, "totalMonthlyPrice">;

export const findDesk = (id: string | null) =>
  id ? desks.find((desk) => desk.id === id) : undefined;

export const findChair = (id: string | null) =>
  id ? chairs.find((chair) => chair.id === id) : undefined;

export const findAccessory = (id: string) =>
  accessories.find((accessory) => accessory.id === id);

export const calculateTotalMonthlyPrice = (
  selectedDesk: string | null,
  selectedChair: string | null,
  selectedAccessories: SelectedAccessory[],
) => {
  const deskTotal = findDesk(selectedDesk)?.pricePerMonth ?? 0;
  const chairTotal = findChair(selectedChair)?.pricePerMonth ?? 0;
  const accessoryTotal = selectedAccessories.reduce((total, selectedAccessory) => {
    const accessory = findAccessory(selectedAccessory.id);

    return total + (accessory?.pricePerMonth ?? 0) * selectedAccessory.quantity;
  }, 0);

  return deskTotal + chairTotal + accessoryTotal;
};

export const formatIdr = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
