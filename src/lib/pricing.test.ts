import {
  calculateSelectedSetupTotal,
  calculateMonthlyTotal,
  calculateRentalEstimate,
  calculateWeeklyTotal,
  getRentalDuration,
  getMonthlyPrice,
  getWeeklyPrice,
  isBestValueDuration,
  rentalDurationOptions,
} from "@/lib/pricing";

describe("Pricing Functions", () => {
  describe("calculateMonthlyTotal", () => {
    it("should return null when no products are selected", () => {
      expect(calculateMonthlyTotal([])).toBeNull();
    });

    it("should calculate a known monthly product correctly", () => {
      expect(
        calculateMonthlyTotal([{ id: "monitor-27-4k-multimedia", quantity: 1 }]),
      ).toBe(48);
    });

    it("should respect quantity for monthly totals", () => {
      expect(
        calculateMonthlyTotal([{ id: "monitor-27-4k-multimedia", quantity: 2 }]),
      ).toBe(96);
    });

    it("should estimate monthly price from weekly data when needed", () => {
      expect(
        calculateMonthlyTotal([{ id: "monitor-a24i-2026", quantity: 1 }]),
      ).toBe(24);
    });
  });

  describe("calculateWeeklyTotal", () => {
    it("should calculate a known weekly product correctly", () => {
      expect(calculateWeeklyTotal([{ id: "monitor-a24i-2026", quantity: 1 }])).toBe(6);
    });

    it("should estimate weekly price from monthly data when needed", () => {
      expect(calculateWeeklyTotal([{ id: "monitor-34-4k-gaming", quantity: 1 }])).toBe(19);
    });
  });

  describe("catalog price helpers", () => {
    it("should resolve weekly and monthly values with fallbacks", () => {
      expect(getWeeklyPrice({ priceWeekly: 12, priceMonthly: 48 })).toBe(12);
      expect(getMonthlyPrice({ priceWeekly: 12, priceMonthly: 48 })).toBe(48);

      expect(getWeeklyPrice({ priceWeekly: null, priceMonthly: 76 })).toBe(19);
      expect(getMonthlyPrice({ priceWeekly: 6, priceMonthly: null })).toBe(24);
    });
  });

  describe("getRentalDuration", () => {
    it("should return correct duration for valid labels", () => {
      expect(getRentalDuration("1 month").months).toBe(1);
      expect(getRentalDuration("3 months").months).toBe(3);
      expect(getRentalDuration("6 months").months).toBe(6);
    });

    it("should return default duration for invalid label", () => {
      expect(getRentalDuration("invalid")).toEqual(rentalDurationOptions[0]);
    });

    it("should handle Flexible correctly", () => {
      expect(getRentalDuration("Flexible").months).toBe(1);
    });
  });

  describe("calculateRentalEstimate", () => {
    it("should calculate estimates from monthly totals", () => {
      expect(calculateRentalEstimate(48, "1 month")).toBe(48);
      expect(calculateRentalEstimate(48, "3 months")).toBe(144);
      expect(calculateRentalEstimate(48, "6 months")).toBe(288);
    });

    it("should return null when the monthly total is unavailable", () => {
      expect(calculateRentalEstimate(null, "3 months")).toBeNull();
    });

    it("should fall back to the default duration for invalid labels", () => {
      expect(calculateRentalEstimate(48, "invalid")).toBe(48);
    });
  });

  describe("calculateSelectedSetupTotal", () => {
    it("should include estimated prices in totals", () => {
      const result = calculateSelectedSetupTotal([
        { id: "monitor-a24i-2026", quantity: 1 },
        { id: "monitor-27-4k-multimedia", quantity: 1 },
        { id: "monitor-a27i", quantity: 1 },
      ]);

      expect(result.monthlyTotal).toBe(104);
      expect(result.weeklyTotal).toBe(26);
      expect(result.unavailableCount).toBe(0);
    });
  });

  describe("isBestValueDuration", () => {
    it("should return true for durations >= 3 months", () => {
      expect(isBestValueDuration("3 months")).toBe(true);
      expect(isBestValueDuration("6 months")).toBe(true);
    });

    it("should return false for shorter durations", () => {
      expect(isBestValueDuration("1 month")).toBe(false);
      expect(isBestValueDuration("2 months")).toBe(false);
      expect(isBestValueDuration("Flexible")).toBe(false);
    });
  });

  describe("rentalDurationOptions", () => {
    it("should keep the expected option list", () => {
      expect(rentalDurationOptions).toHaveLength(5);
      expect(rentalDurationOptions.map((option) => option.label)).toEqual([
        "1 month",
        "2 months",
        "3 months",
        "6 months",
        "Flexible",
      ]);
      expect(rentalDurationOptions.map((option) => option.months)).toEqual([1, 2, 3, 6, 1]);
    });
  });
});
