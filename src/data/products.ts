import rawProducts from "../../public/monis-electronics-with-prices.json";

export type RawProductVariant = {
  name?: string;
  priceWeekly?: number | null;
  priceMonthly?: number | null;
  originalPriceWeekly?: number | null;
  originalPriceMonthly?: number | null;
  savingsLabel?: string | null;
};

export type RawProduct = {
  id?: string;
  category?: string;
  name?: string;
  productUrl?: string;
  imageUrl?: string;
  localImage?: string;
  shortDescription?: string;
  specs?: Record<string, unknown>;
  priceCurrency?: string;
  priceBillingUnit?: string;
  priceWeekly?: number | null;
  priceMonthly?: number | null;
  originalPriceWeekly?: number | null;
  originalPriceMonthly?: number | null;
  savingsLabel?: string | null;
  priceStatus?: string;
  priceNote?: string | null;
  variants?: RawProductVariant[];
};

export type CatalogSectionKey =
  | "monitors"
  | "office-accessories"
  | "smart-home"
  | "computer"
  | "gaming"
  | "audio-video";

export type CatalogSection = {
  key: CatalogSectionKey;
  label: string;
  description: string;
};

export type CatalogProduct = {
  id: string;
  category: string;
  section: CatalogSectionKey | "other";
  name: string;
  productUrl?: string;
  imageUrl?: string;
  localImage?: string;
  image: string;
  shortDescription: string;
  specs: Record<string, unknown>;
  priceCurrency: string;
  priceBillingUnit?: string;
  priceWeekly: number | null;
  priceMonthly: number | null;
  originalPriceWeekly?: number | null;
  originalPriceMonthly?: number | null;
  savingsLabel?: string | null;
  priceStatus?: string;
  priceNote?: string | null;
  variants: RawProductVariant[];
};

export type SelectedProduct = {
  id: string;
  quantity: number;
};

export type ConfiguratorState = {
  selectedProducts: SelectedProduct[];
  totalWeeklyPrice: number | null;
  totalMonthlyPrice: number | null;
};

const fallbackImage = "/products/fallback-product.svg";

export const catalogSections: CatalogSection[] = [
  {
    key: "monitors",
    label: "Monitors",
    description: "Display upgrades for focused work and creative setups.",
  },
  {
    key: "office-accessories",
    label: "Office Accessories",
    description: "Desk utilities, cable support, and workspace add-ons.",
  },
  {
    key: "smart-home",
    label: "Smart Home",
    description: "Comfort and convenience items for the workspace and room.",
  },
  {
    key: "computer",
    label: "Computer",
    description: "Core computing gear that can sit alongside the main setup.",
  },
  {
    key: "gaming",
    label: "Gaming",
    description: "Optional equipment for high-performance and entertainment use.",
  },
  {
    key: "audio-video",
    label: "Audio & Video",
    description: "Camera, sound, and media equipment for call-heavy work.",
  },
];

const sectionByCategory: Record<string, CatalogSectionKey> = {
  monitors: "monitors",
  "office-accessories": "office-accessories",
  "smart-home": "smart-home",
  computer: "computer",
  gaming: "gaming",
  "audio-video": "audio-video",
};

function toSectionKey(category: string | undefined): CatalogSectionKey | "other" {
  if (!category) return "other";
  return sectionByCategory[category] ?? "other";
}

function toCatalogProduct(product: RawProduct, index: number): CatalogProduct {
  const image = product.localImage || product.imageUrl || fallbackImage;

  return {
    id: product.id || `product-${index + 1}`,
    category: product.category || "uncategorized",
    section: toSectionKey(product.category),
    name: product.name || "Unnamed product",
    productUrl: product.productUrl,
    imageUrl: product.imageUrl,
    localImage: product.localImage,
    image,
    shortDescription: product.shortDescription || "Details coming soon.",
    specs: product.specs || {},
    priceCurrency: product.priceCurrency || "USD",
    priceBillingUnit: product.priceBillingUnit,
    priceWeekly: product.priceWeekly ?? null,
    priceMonthly: product.priceMonthly ?? null,
    originalPriceWeekly: product.originalPriceWeekly ?? null,
    originalPriceMonthly: product.originalPriceMonthly ?? null,
    savingsLabel: product.savingsLabel ?? null,
    priceStatus: product.priceStatus,
    priceNote: product.priceNote ?? null,
    variants: Array.isArray(product.variants) ? product.variants : [],
  };
}

export const products: CatalogProduct[] = (rawProducts as RawProduct[]).map(toCatalogProduct);

export const productCategories = catalogSections.map((section) => section.key);

export const defaultConfiguratorSelections = {
  selectedProducts: [],
} satisfies Pick<ConfiguratorState, "selectedProducts">;

export function findProduct(id: string | null | undefined) {
  if (!id) return undefined;
  return products.find((product) => product.id === id);
}

export function findProductsByIds(ids: string[]) {
  return ids.map((id) => findProduct(id)).filter((item): item is CatalogProduct => Boolean(item));
}

export function getProductImage(product: Pick<CatalogProduct, "image" | "imageUrl" | "localImage">) {
  return product.localImage || product.imageUrl || product.image || fallbackImage;
}

export function getProductSection(product: Pick<CatalogProduct, "section">) {
  return product.section;
}

export function groupProductsBySection(items: CatalogProduct[] = products) {
  return catalogSections
    .map((section) => ({
      ...section,
      products: items.filter((product) => product.section === section.key),
    }))
    .filter((section) => section.products.length > 0);
}

export function formatPrice(
  value: number | null | undefined,
  currency = "USD",
  fallback = "Price on request",
) {
  if (value === null || value === undefined || !Number.isFinite(value) || value <= 0) {
    return fallback;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(Math.round(value));
}

export function formatCurrency(value: number | null | undefined, currency = "USD") {
  return formatPrice(value, currency);
}

export function formatMoneyOrFallback(
  value: number | null | undefined,
  currency: string,
  fallback: string,
) {
  return formatPrice(value, currency, fallback);
}

export function formatCategoryLabel(category: string | undefined | null) {
  if (!category) return "Uncategorized";

  return category
    .replace(/[-_]/g, " ")
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function getWeeklyPrice(product: Pick<CatalogProduct, "priceWeekly" | "priceMonthly">) {
  if (product.priceWeekly !== null && product.priceWeekly !== undefined) {
    return product.priceWeekly;
  }

  if (product.priceMonthly !== null && product.priceMonthly !== undefined) {
    return product.priceMonthly / 4;
  }

  return null;
}

export function getMonthlyPrice(product: Pick<CatalogProduct, "priceWeekly" | "priceMonthly">) {
  if (product.priceMonthly !== null && product.priceMonthly !== undefined) {
    return product.priceMonthly;
  }

  if (product.priceWeekly !== null && product.priceWeekly !== undefined) {
    return product.priceWeekly * 4;
  }

  return null;
}

export function calculateSelectedSetupTotal(selectedItems: Array<SelectedProduct | { product: CatalogProduct; quantity: number }>) {
  let weeklyTotal = 0;
  let monthlyTotal = 0;
  let unavailableCount = 0;

  selectedItems.forEach((selectedItem) => {
    const product =
      "product" in selectedItem ? selectedItem.product : findProduct(selectedItem.id);
    const quantity = selectedItem.quantity;

    if (!product) return;

    const weeklyPrice = getWeeklyPrice(product);
    const monthlyPrice = getMonthlyPrice(product);

    if (weeklyPrice === null && monthlyPrice === null) {
      unavailableCount += quantity;
      return;
    }

    if (weeklyPrice !== null) {
      weeklyTotal += weeklyPrice * quantity;
    }

    if (monthlyPrice !== null) {
      monthlyTotal += monthlyPrice * quantity;
    }
  });

  return {
    weeklyTotal: weeklyTotal > 0 ? weeklyTotal : null,
    monthlyTotal: monthlyTotal > 0 ? monthlyTotal : null,
    unavailableCount,
  };
}

export function calculateMonthlyTotal(selectedItems: SelectedProduct[]) {
  return calculateSelectedSetupTotal(selectedItems).monthlyTotal;
}

export function calculateWeeklyTotal(selectedItems: SelectedProduct[]) {
  return calculateSelectedSetupTotal(selectedItems).weeklyTotal;
}
