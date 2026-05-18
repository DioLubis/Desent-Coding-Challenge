import type { LucideIcon } from "lucide-react";
import {
  Armchair,
  BriefcaseBusiness,
  LampDesk,
  Leaf,
  Monitor,
  Sparkles,
  Table2,
  Wifi,
} from "lucide-react";

export type ProductCategory = "Core" | "Focus" | "Atmosphere";

export type RentalProduct = {
  id: string;
  name: string;
  category: ProductCategory;
  description: string;
  price: number;
  color: string;
  accent: string;
  icon: LucideIcon;
};

export const rentalProducts: RentalProduct[] = [
  {
    id: "standing-desk",
    name: "Bamboo Standing Desk",
    category: "Core",
    description: "A warm adjustable desk sized for laptops, notebooks, and a good Bali coffee.",
    price: 420000,
    color: "bg-[#d78f43]",
    accent: "from-[#f5b76b] to-[#bc6f2e]",
    icon: Table2,
  },
  {
    id: "ergonomic-chair",
    name: "Ergo Cloud Chair",
    category: "Core",
    description: "Breathable support for long building sessions without turning the room corporate.",
    price: 280000,
    color: "bg-[#325d66]",
    accent: "from-[#76b5bd] to-[#2c6d79]",
    icon: Armchair,
  },
  {
    id: "studio-monitor",
    name: "27-inch Creator Display",
    category: "Focus",
    description: "Crisp external screen for design reviews, spreadsheets, and async calls.",
    price: 340000,
    color: "bg-[#33313f]",
    accent: "from-[#6c6b7d] to-[#252431]",
    icon: Monitor,
  },
  {
    id: "task-light",
    name: "Sunset Task Lamp",
    category: "Focus",
    description: "Dimmable amber light to keep evenings gentle and the desk photogenic.",
    price: 90000,
    color: "bg-[#f2b84b]",
    accent: "from-[#ffd36b] to-[#e1922f]",
    icon: LampDesk,
  },
  {
    id: "wifi-kit",
    name: "Nomad Wi-Fi Kit",
    category: "Focus",
    description: "Reliable hotspot and cable kit for villas, studios, and pop-up team spaces.",
    price: 150000,
    color: "bg-[#3f7fbe]",
    accent: "from-[#83c5f4] to-[#2f72b6]",
    icon: Wifi,
  },
  {
    id: "green-corner",
    name: "Tropical Green Corner",
    category: "Atmosphere",
    description: "Two low-maintenance plants and a woven mat to soften the work zone.",
    price: 120000,
    color: "bg-[#4a8b62]",
    accent: "from-[#86c987] to-[#367a4c]",
    icon: Leaf,
  },
  {
    id: "founder-kit",
    name: "Founder Whiteboard Kit",
    category: "Atmosphere",
    description: "Portable board, markers, sticky notes, and a tote for sprint planning.",
    price: 110000,
    color: "bg-[#f06f61]",
    accent: "from-[#ff9f8e] to-[#db584d]",
    icon: BriefcaseBusiness,
  },
  {
    id: "vibe-pack",
    name: "Room Vibe Pack",
    category: "Atmosphere",
    description: "Cable clips, scent diffuser, small speaker, and a few visual details.",
    price: 80000,
    color: "bg-[#9b69b6]",
    accent: "from-[#cf9ce6] to-[#8350a2]",
    icon: Sparkles,
  },
];

export const defaultProductIds = ["standing-desk", "ergonomic-chair", "studio-monitor", "task-light"];

export const formatIdr = (value: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
