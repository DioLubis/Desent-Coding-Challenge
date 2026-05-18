import {
  defaultConfiguratorSelections,
  findProduct,
  formatCategoryLabel,
  formatCurrency,
  formatMoneyOrFallback,
  productCategories,
  products,
} from "@/data/products";

describe("Products Data", () => {
  it("should load products from the JSON feed", () => {
    expect(products.length).toBeGreaterThan(0);
    expect(productCategories.length).toBeGreaterThan(0);
    expect(productCategories).toContain("monitors");
  });

  it("should keep the default selection empty", () => {
    expect(defaultConfiguratorSelections.selectedProducts).toEqual([]);
  });

  it("should find a known product by id", () => {
    const product = findProduct("monitor-27-4k-multimedia");

    expect(product).toBeDefined();
    expect(product?.name).toBe('27" 4K Multimedia Monitor');
    expect(product?.category).toBe("monitors");
    expect(product?.image).toBeDefined();
    expect(product?.shortDescription).toContain("4K monitor");
    expect(product?.priceWeekly).toBe(12);
    expect(product?.priceMonthly).toBe(48);
  });

  it("should return undefined for an unknown product", () => {
    expect(findProduct("missing-product")).toBeUndefined();
  });

  it("should keep product labels and fallback text stable", () => {
    expect(formatCategoryLabel("office-accessories")).toBe("Office Accessories");
    expect(formatCategoryLabel(null)).toBe("Uncategorized");
    expect(formatMoneyOrFallback(null, "USD", "Check availability")).toBe("Check availability");
    expect(formatCurrency(48, "USD")).toBe("$48");
  });

  it("should keep every product resilient enough to render", () => {
    products.forEach((product) => {
      expect(product.id).toBeDefined();
      expect(product.name).toBeDefined();
      expect(product.category).toBeDefined();
      expect(product.image).toBeDefined();
      expect(product.shortDescription).toBeDefined();
      expect(product.specs).toBeDefined();
      expect(typeof product.shortDescription).toBe("string");
      expect(typeof product.image).toBe("string");
      expect(Array.isArray(product.variants)).toBe(true);
    });
  });

  it("should preserve products with missing prices", () => {
    const product = findProduct("monitor-a24i-2026");

    expect(product).toBeDefined();
    expect(product?.priceWeekly).toBe(6);
    expect(product?.priceMonthly).toBeNull();
  });
});
