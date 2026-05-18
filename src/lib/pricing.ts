import {
  findProduct,
  getMonthlyPrice,
  getWeeklyPrice,
  calculateSelectedSetupTotal,
  type SelectedProduct,
} from "@/data/products";

export { calculateSelectedSetupTotal };
export { getMonthlyPrice, getWeeklyPrice };

export type RentalDurationOption = {
  label: string;
  months: number;
};

export const rentalDurationOptions: RentalDurationOption[] = [
  { label: "1 month", months: 1 },
  { label: "2 months", months: 2 },
  { label: "3 months", months: 3 },
  { label: "6 months", months: 6 },
  { label: "Flexible", months: 1 },
];

export function calculateMonthlyTotal(
  selectedProducts: SelectedProduct[],
) {
  let pricedItems = 0;

  const total = selectedProducts.reduce((runningTotal, selectedProduct) => {
    const product = findProduct(selectedProduct.id);
    const price = product ? getMonthlyPrice(product) : null;

    if (price === null) {
      return runningTotal;
    }

    pricedItems += selectedProduct.quantity;
    return runningTotal + price * selectedProduct.quantity;
  }, 0);

  return pricedItems === 0 ? null : total;
}

export function calculateWeeklyTotal(selectedProducts: SelectedProduct[]) {
  let pricedItems = 0;

  const total = selectedProducts.reduce((runningTotal, selectedProduct) => {
    const product = findProduct(selectedProduct.id);
    const price = product ? getWeeklyPrice(product) : null;

    if (price === null) {
      return runningTotal;
    }

    pricedItems += selectedProduct.quantity;
    return runningTotal + price * selectedProduct.quantity;
  }, 0);

  return pricedItems === 0 ? null : total;
}

export function getRentalDuration(label: string) {
  return rentalDurationOptions.find((option) => option.label === label) ?? rentalDurationOptions[0];
}

export function calculateRentalEstimate(monthlyTotal: number | null, durationLabel: string) {
  if (monthlyTotal === null) return null;

  return monthlyTotal * getRentalDuration(durationLabel).months;
}

export function isBestValueDuration(durationLabel: string) {
  return getRentalDuration(durationLabel).months >= 3;
}
