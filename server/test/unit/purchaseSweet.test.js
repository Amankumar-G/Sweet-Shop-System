import purchaseSweet from "../../src/services/purchaseSweet.js";
import Sweet from "../../src/models/Sweet";

describe("purchaseSweet", () => {
    it("should successfully purchase sweet when sufficient stock is available", async () => {
      const sweetId = "mock-id-123";
      const quantity = 5;
      const mockSweet = {
        _id: sweetId,
        name: "Chocolate Bar",
        category: "chocolate",
        price: 2.5,
        quantity: 10,
        save: jest.fn().mockResolvedValue({
          _id: sweetId,
          name: "Chocolate Bar",
          category: "chocolate",
          price: 2.5,
          quantity: 5,
        })
      };

      Sweet.findById = jest.fn().mockResolvedValue(mockSweet);

      const result = await purchaseSweet(sweetId, quantity);

      expect(result).toEqual({
        sweet: {
          _id: sweetId,
          name: "Chocolate Bar",
          category: "chocolate",
          price: 2.5,
          quantity: 5,
        },
        purchasedQuantity: 5,
        remainingQuantity: 5
      });
      expect(Sweet.findById).toHaveBeenCalledWith(sweetId);
      expect(mockSweet.save).toHaveBeenCalledTimes(1);
    });

    it("should throw error when sweet is not found", async () => {
      const sweetId = "non-existent-id";
      Sweet.findById = jest.fn().mockResolvedValue(null);

      await expect(purchaseSweet(sweetId, 5)).rejects.toThrow("Failed to purchase sweet: Sweet not found");
    });

    it("should throw error when insufficient stock is available", async () => {
      const sweetId = "mock-id-123";
      const quantity = 15;
      const mockSweet = {
        _id: sweetId,
        name: "Chocolate Bar",
        quantity: 10,
      };

      Sweet.findById = jest.fn().mockResolvedValue(mockSweet);

      await expect(purchaseSweet(sweetId, quantity)).rejects.toThrow("Failed to purchase sweet: Insufficient stock available");
    });

    it("should throw error when purchase quantity is zero or negative", async () => {
      const sweetId = "mock-id-123";

      await expect(purchaseSweet(sweetId, 0)).rejects.toThrow("Failed to purchase sweet: Purchase quantity must be greater than 0");
      await expect(purchaseSweet(sweetId, -5)).rejects.toThrow("Failed to purchase sweet: Purchase quantity must be greater than 0");
    });

    it("should throw error when database operation fails", async () => {
      const sweetId = "mock-id-123";
      Sweet.findById = jest.fn().mockRejectedValue(new Error("Database error"));

      await expect(purchaseSweet(sweetId, 5)).rejects.toThrow("Failed to purchase sweet: Database error");
    });
  });