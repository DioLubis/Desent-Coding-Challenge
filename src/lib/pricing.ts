import { findAccessory, findChair, findDesk, type SelectedAccessory } from "@/data/products";

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
  selectedDesk: string | null,
  selectedChair: string | null,
  selectedAccessories: SelectedAccessory[],
) {
  const deskTotal = findDesk(selectedDesk)?.pricePerMonth ?? 0;
  const chairTotal = findChair(selectedChair)?.pricePerMonth ?? 0;
  const accessoryTotal = selectedAccessories.reduce((total, selectedAccessory) => {
    const accessory = findAccessory(selectedAccessory.id);

    return total + (accessory?.pricePerMonth ?? 0) * selectedAccessory.quantity;
  }, 0);

  return deskTotal + chairTotal + accessoryTotal;
}

export function getRentalDuration(label: string) {
  return rentalDurationOptions.find((option) => option.label === label) ?? rentalDurationOptions[0];
}

export function calculateRentalEstimate(monthlyTotal: number, durationLabel: string) {
  return monthlyTotal * getRentalDuration(durationLabel).months;
}

export function isBestValueDuration(durationLabel: string) {
  return getRentalDuration(durationLabel).months >= 3;
}
