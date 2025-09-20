import sortSweets from "../../src/services/sortSweets.js";
import Sweet from "../../src/models/Sweet";

describe("sortSweets", () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe("when sweets array is NOT provided", () => {
    it("should sort from DB by name ascending (default)", async () => {
      const mockSweets = [
        { _id: "1", name: "A" },
        { _id: "2", name: "B" },
      ];

      const mockSort = jest.fn().mockResolvedValue(mockSweets);
      Sweet.find = jest.fn().mockReturnValue({ sort: mockSort });

      const result = await sortSweets();

      expect(Sweet.find).toHaveBeenCalledWith();
      expect(mockSort).toHaveBeenCalledWith({ name: 1 });
      expect(result).toEqual(mockSweets);
    });

    it("should sort from DB by price descending", async () => {
      const mockSweets = [{ price: 10 }, { price: 5 }];

      Sweet.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue(mockSweets),
      });

      const result = await sortSweets(undefined, "price", "desc");

      expect(Sweet.find().sort).toHaveBeenCalledWith({ price: -1 });
      expect(result).toEqual(mockSweets);
    });

    it("should throw error if DB call fails", async () => {
      Sweet.find = jest.fn().mockReturnValue({
        sort: jest.fn().mockRejectedValue(new Error("DB error")),
      });

      await expect(sortSweets()).rejects.toThrow(
        "Failed to sort sweets: DB error"
      );
    });
  });

  describe("when sweets array IS provided", () => {
    const sampleSweets = [
      { name: "Z", price: 5, quantity: 10, category: "candy" },
      { name: "A", price: 10, quantity: 5, category: "chocolate" },
    ];

    it("should sort given sweets array by name ascending (default)", async () => {
      const result = await sortSweets(sampleSweets);

      expect(result).toEqual([
        { name: "A", price: 10, quantity: 5, category: "chocolate" },
        { name: "Z", price: 5, quantity: 10, category: "candy" },
      ]);
    });

    it("should sort by quantity descending", async () => {
      const result = await sortSweets(sampleSweets, "quantity", "desc");

      expect(result).toEqual([
        { name: "Z", price: 5, quantity: 10, category: "candy" },
        { name: "A", price: 10, quantity: 5, category: "chocolate" },
      ]);
    });

    it("should throw error for invalid field", async () => {
      await expect(sortSweets(sampleSweets, "invalid")).rejects.toThrow(
        "Failed to sort sweets: Invalid sort field"
      );
    });

    it("should throw error for invalid sort direction", async () => {
      await expect(sortSweets(sampleSweets, "price", "up")).rejects.toThrow(
        "Failed to sort sweets: Invalid sort direction"
      );
    });
  });
});
