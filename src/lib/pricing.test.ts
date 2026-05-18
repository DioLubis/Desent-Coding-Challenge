import {
  calculateMonthlyTotal,
  calculateRentalEstimate,
  getRentalDuration,
  isBestValueDuration,
  rentalDurationOptions,
} from "@/lib/pricing";

describe("Pricing Functions", () => {
  describe("calculateMonthlyTotal", () => {
    it("should return 0 when no items are selected", () => {
      const total = calculateMonthlyTotal(null, null, []);
      expect(total).toBe(0);
    });

    it("should calculate correctly with only a desk selected", () => {
      // Bamboo Standing Desk: 1680000
      const total = calculateMonthlyTotal("bamboo-standing-desk", null, []);
      expect(total).toBe(1680000);
    });

    it("should calculate correctly with only a chair selected", () => {
      // Ergo Cloud Chair: 1120000
      const total = calculateMonthlyTotal(null, "ergo-cloud-chair", []);
      expect(total).toBe(1120000);
    });

    it("should calculate correctly with desk and chair selected", () => {
      // Bamboo Standing Desk: 1680000 + Ergo Cloud Chair: 1120000 = 2800000
      const total = calculateMonthlyTotal(
        "bamboo-standing-desk",
        "ergo-cloud-chair",
        [],
      );
      expect(total).toBe(2800000);
    });

    it("should handle invalid desk ID gracefully", () => {
      const total = calculateMonthlyTotal("invalid-desk", "ergo-cloud-chair", []);
      expect(total).toBe(1120000);
    });

    it("should handle invalid chair ID gracefully", () => {
      const total = calculateMonthlyTotal("bamboo-standing-desk", "invalid-chair", []);
      expect(total).toBe(1680000);
    });
  });

  describe("Adding accessories updates the total", () => {
    it("should include single accessory in total", () => {
      // Bamboo Standing Desk: 1680000 + Sunset Task Lamp: 360000 = 2040000
      const total = calculateMonthlyTotal("bamboo-standing-desk", null, [
        { id: "sunset-task-lamp", quantity: 1 },
      ]);
      expect(total).toBe(2040000);
    });

    it("should include multiple different accessories", () => {
      // Bamboo Standing Desk: 1680000 
      // + Sunset Task Lamp: 360000 
      // + Tropical Desk Plant: 220000 
      // = 2260000
      const total = calculateMonthlyTotal("bamboo-standing-desk", null, [
        { id: "sunset-task-lamp", quantity: 1 },
        { id: "tropical-plant", quantity: 1 },
      ]);
      expect(total).toBe(2260000);
    });

    it("should respect quantity for adjustable accessories", () => {
      // Bamboo Standing Desk: 1680000 
      // + 27-inch Creator Monitor: 1360000 * 2 = 2720000
      // = 4400000
      const total = calculateMonthlyTotal("bamboo-standing-desk", null, [
        { id: "creator-monitor", quantity: 2 },
      ]);
      expect(total).toBe(4400000);
    });

    it("should combine desk, chair, and multiple accessories", () => {
      // Bamboo Standing Desk: 1680000
      // + Ergo Cloud Chair: 1120000
      // + Sunset Task Lamp: 360000
      // + Tropical Desk Plant: 220000
      // = 3380000
      const total = calculateMonthlyTotal("bamboo-standing-desk", "ergo-cloud-chair", [
        { id: "sunset-task-lamp", quantity: 1 },
        { id: "tropical-plant", quantity: 1 },
      ]);
      expect(total).toBe(3380000);
    });
  });

  describe("Removing accessories updates the total", () => {
    it("should return desk price when accessories are removed", () => {
      // Starting with accessories then removing them
      let total = calculateMonthlyTotal("bamboo-standing-desk", null, [
        { id: "sunset-task-lamp", quantity: 1 },
      ]);
      expect(total).toBe(2040000);

      // After removing
      total = calculateMonthlyTotal("bamboo-standing-desk", null, []);
      expect(total).toBe(1680000);
    });

    it("should correctly calculate after removing one of multiple accessories", () => {
      // With 2 accessories
      const totalWith2 = calculateMonthlyTotal("bamboo-standing-desk", null, [
        { id: "sunset-task-lamp", quantity: 1 },
        { id: "tropical-plant", quantity: 1 },
      ]);
      expect(totalWith2).toBe(2260000);

      // After removing one
      const totalWith1 = calculateMonthlyTotal("bamboo-standing-desk", null, [
        { id: "sunset-task-lamp", quantity: 1 },
      ]);
      expect(totalWith1).toBe(2040000);
    });

    it("should reduce total when decreasing accessory quantity", () => {
      // With quantity 2
      const totalQty2 = calculateMonthlyTotal("bamboo-standing-desk", null, [
        { id: "creator-monitor", quantity: 2 },
      ]);
      expect(totalQty2).toBe(4400000);

      // With quantity 1
      const totalQty1 = calculateMonthlyTotal("bamboo-standing-desk", null, [
        { id: "creator-monitor", quantity: 1 },
      ]);
      expect(totalQty1).toBe(3040000);
    });
  });

  describe("getRentalDuration", () => {
    it("should return correct duration for valid labels", () => {
      const onMonth = getRentalDuration("1 month");
      expect(onMonth.months).toBe(1);

      const threeMonths = getRentalDuration("3 months");
      expect(threeMonths.months).toBe(3);

      const sixMonths = getRentalDuration("6 months");
      expect(sixMonths.months).toBe(6);
    });

    it("should return default duration for invalid label", () => {
      const invalid = getRentalDuration("invalid");
      expect(invalid).toEqual(rentalDurationOptions[0]);
      expect(invalid.months).toBe(1);
    });

    it("should handle 'Flexible' option correctly", () => {
      const flexible = getRentalDuration("Flexible");
      expect(flexible.months).toBe(1);
    });
  });

  describe("Rental duration estimate is calculated correctly", () => {
    it("should calculate estimate for 1 month rental", () => {
      const monthlyTotal = 1000000;
      const estimate = calculateRentalEstimate(monthlyTotal, "1 month");
      expect(estimate).toBe(1000000);
    });

    it("should calculate estimate for 3 month rental", () => {
      const monthlyTotal = 1000000;
      const estimate = calculateRentalEstimate(monthlyTotal, "3 months");
      expect(estimate).toBe(3000000);
    });

    it("should calculate estimate for 6 month rental", () => {
      const monthlyTotal = 1000000;
      const estimate = calculateRentalEstimate(monthlyTotal, "6 months");
      expect(estimate).toBe(6000000);
    });

    it("should calculate estimate correctly with real pricing data", () => {
      // Bamboo Standing Desk + Ergo Cloud Chair = 2800000 per month
      // For 3 months = 8400000
      const monthlyTotal = calculateMonthlyTotal(
        "bamboo-standing-desk",
        "ergo-cloud-chair",
        [],
      );
      const estimate = calculateRentalEstimate(monthlyTotal, "3 months");
      expect(estimate).toBe(8400000);
    });

    it("should calculate estimate with complex setup", () => {
      // Founder Studio Desk: 2100000
      // Task Pro Chair: 1350000
      // 27-inch Creator Monitor x2: 2720000
      // Total monthly: 6170000
      // For 6 months: 37020000
      const monthlyTotal = calculateMonthlyTotal(
        "founder-studio-desk",
        "task-pro-chair",
        [{ id: "creator-monitor", quantity: 2 }],
      );
      expect(monthlyTotal).toBe(6170000);

      const estimate = calculateRentalEstimate(monthlyTotal, "6 months");
      expect(estimate).toBe(37020000);
    });

    it("should return default 1-month estimate for invalid duration", () => {
      const monthlyTotal = 1000000;
      const estimate = calculateRentalEstimate(monthlyTotal, "invalid");
      expect(estimate).toBe(1000000);
    });
  });

  describe("isBestValueDuration", () => {
    it("should return true for durations >= 3 months", () => {
      expect(isBestValueDuration("3 months")).toBe(true);
      expect(isBestValueDuration("6 months")).toBe(true);
    });

    it("should return false for durations < 3 months", () => {
      expect(isBestValueDuration("1 month")).toBe(false);
      expect(isBestValueDuration("2 months")).toBe(false);
      expect(isBestValueDuration("Flexible")).toBe(false);
    });
  });

  describe("Preset setup returns the correct selected items", () => {
    it("should have all rental duration options available", () => {
      expect(rentalDurationOptions).toHaveLength(5);
      expect(rentalDurationOptions[0].label).toBe("1 month");
      expect(rentalDurationOptions[1].label).toBe("2 months");
      expect(rentalDurationOptions[2].label).toBe("3 months");
      expect(rentalDurationOptions[3].label).toBe("6 months");
      expect(rentalDurationOptions[4].label).toBe("Flexible");
    });

    it("should have correct month values for each duration option", () => {
      expect(rentalDurationOptions.map((o) => o.months)).toEqual([1, 2, 3, 6, 1]);
    });
  });
});
