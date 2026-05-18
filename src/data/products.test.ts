import {
  defaultConfiguratorSelections,
  findAccessory,
  findChair,
  findDesk,
  desks,
  chairs,
  accessories,
} from "@/data/products";

describe("Products Data", () => {
  describe("Preset setup returns the correct selected items", () => {
    it("should have default empty selections", () => {
      expect(defaultConfiguratorSelections.selectedDesk).toBeNull();
      expect(defaultConfiguratorSelections.selectedChair).toBeNull();
      expect(defaultConfiguratorSelections.selectedAccessories).toEqual([]);
    });

    it("should have all required product categories", () => {
      expect(desks.length).toBeGreaterThan(0);
      expect(chairs.length).toBeGreaterThan(0);
      expect(accessories.length).toBeGreaterThan(0);
    });
  });

  describe("findDesk", () => {
    it("should find a desk by ID", () => {
      const desk = findDesk("bamboo-standing-desk");
      expect(desk).toBeDefined();
      expect(desk?.name).toBe("Bamboo Standing Desk");
      expect(desk?.pricePerMonth).toBe(1680000);
    });

    it("should return undefined for invalid desk ID", () => {
      const desk = findDesk("invalid-desk");
      expect(desk).toBeUndefined();
    });

    it("should return undefined when ID is null", () => {
      const desk = findDesk(null);
      expect(desk).toBeUndefined();
    });

    it("should find all desk options", () => {
      expect(findDesk("bamboo-standing-desk")).toBeDefined();
      expect(findDesk("compact-focus-desk")).toBeDefined();
      expect(findDesk("founder-studio-desk")).toBeDefined();
    });
  });

  describe("findChair", () => {
    it("should find a chair by ID", () => {
      const chair = findChair("ergo-cloud-chair");
      expect(chair).toBeDefined();
      expect(chair?.name).toBe("Ergo Cloud Chair");
      expect(chair?.pricePerMonth).toBe(1120000);
    });

    it("should return undefined for invalid chair ID", () => {
      const chair = findChair("invalid-chair");
      expect(chair).toBeUndefined();
    });

    it("should return undefined when ID is null", () => {
      const chair = findChair(null);
      expect(chair).toBeUndefined();
    });

    it("should find all chair options", () => {
      expect(findChair("ergo-cloud-chair")).toBeDefined();
      expect(findChair("rattan-lounge-chair")).toBeDefined();
      expect(findChair("task-pro-chair")).toBeDefined();
    });
  });

  describe("findAccessory", () => {
    it("should find an accessory by ID", () => {
      const accessory = findAccessory("sunset-task-lamp");
      expect(accessory).toBeDefined();
      expect(accessory?.name).toBe("Sunset Task Lamp");
      expect(accessory?.pricePerMonth).toBe(360000);
    });

    it("should return undefined for invalid accessory ID", () => {
      const accessory = findAccessory("invalid-accessory");
      expect(accessory).toBeUndefined();
    });

    it("should find all available accessories", () => {
      expect(findAccessory("creator-monitor")).toBeDefined();
      expect(findAccessory("sunset-task-lamp")).toBeDefined();
      expect(findAccessory("tropical-plant")).toBeDefined();
      expect(findAccessory("coffee-machine")).toBeDefined();
      expect(findAccessory("open-shelf")).toBeDefined();
      expect(findAccessory("planning-board")).toBeDefined();
    });

    it("should have quantity adjustable flag for adjustable accessories", () => {
      const monitor = findAccessory("creator-monitor");
      expect(monitor?.quantityAdjustable).toBe(true);
      expect(monitor?.maxQuantity).toBe(2);

      const lamp = findAccessory("sunset-task-lamp");
      expect(lamp?.quantityAdjustable).not.toBe(true);
    });
  });

  describe("Product pricing", () => {
    it("should have all products with valid prices", () => {
      desks.forEach((desk) => {
        expect(desk.pricePerMonth).toBeGreaterThan(0);
      });

      chairs.forEach((chair) => {
        expect(chair.pricePerMonth).toBeGreaterThan(0);
      });

      accessories.forEach((accessory) => {
        expect(accessory.pricePerMonth).toBeGreaterThan(0);
      });
    });

    it("should have expected minimum chair price", () => {
      // Rattan Lounge Chair should be the cheapest
      const chairPrices = chairs.map((c) => c.pricePerMonth);
      expect(Math.min(...chairPrices)).toBe(780000);
    });

    it("should have premium desks more expensive than basic desks", () => {
      const bambooDesk = findDesk("bamboo-standing-desk");
      const compactDesk = findDesk("compact-focus-desk");
      const founderDesk = findDesk("founder-studio-desk");

      expect(founderDesk!.pricePerMonth).toBeGreaterThan(
        bambooDesk!.pricePerMonth,
      );
      expect(bambooDesk!.pricePerMonth).toBeGreaterThan(
        compactDesk!.pricePerMonth,
      );
    });
  });

  describe("Product metadata", () => {
    it("should have all products with required fields", () => {
      desks.forEach((desk) => {
        expect(desk.id).toBeDefined();
        expect(desk.name).toBeDefined();
        expect(desk.category).toBe("desk");
        expect(desk.description).toBeDefined();
        expect(desk.visual).toBeDefined();
        expect(desk.visual.icon).toBeDefined();
        expect(desk.visual.color).toBeDefined();
        expect(desk.visual.accent).toBeDefined();
      });

      chairs.forEach((chair) => {
        expect(chair.id).toBeDefined();
        expect(chair.name).toBeDefined();
        expect(chair.category).toBe("chair");
        expect(chair.description).toBeDefined();
        expect(chair.visual).toBeDefined();
      });

      accessories.forEach((accessory) => {
        expect(accessory.id).toBeDefined();
        expect(accessory.name).toBeDefined();
        expect(accessory.category).toBe("accessory");
        expect(accessory.description).toBeDefined();
        expect(accessory.visual).toBeDefined();
      });
    });

    it("should have unique IDs for each product", () => {
      const allIds = [
        ...desks.map((d) => d.id),
        ...chairs.map((c) => c.id),
        ...accessories.map((a) => a.id),
      ];

      const uniqueIds = new Set(allIds);
      expect(uniqueIds.size).toBe(allIds.length);
    });
  });
});
