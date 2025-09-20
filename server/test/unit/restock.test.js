import Sweet from "../../src/models/Sweet";
import restockSweet from "../../src/services/restockSweet.js";

describe("restockSweet", () => {
  it("should successfully restock sweet", async () => {
    const sweetId = "mock-id-123";
    const quantity = 15;
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
        quantity: 25,
      }),
    };

    Sweet.findById = jest.fn().mockResolvedValue(mockSweet);

    const result = await restockSweet(sweetId, quantity);

    expect(result).toEqual({
      sweet: {
        _id: sweetId,
        name: "Chocolate Bar",
        category: "chocolate",
        price: 2.5,
        quantity: 25,
      },
      restockedQuantity: 15,
      newQuantity: 25,
    });
    expect(Sweet.findById).toHaveBeenCalledWith(sweetId);
    expect(mockSweet.save).toHaveBeenCalledTimes(1);
  });

  it("should throw error when sweet is not found", async () => {
    const sweetId = "non-existent-id";
    Sweet.findById = jest.fn().mockResolvedValue(null);

    await expect(restockSweet(sweetId, 15)).rejects.toThrow(
      "Failed to restock sweet: Sweet not found"
    );
  });

  it("should throw error when restock quantity is zero or negative", async () => {
    const sweetId = "mock-id-123";

    await expect(restockSweet(sweetId, 0)).rejects.toThrow(
      "Failed to restock sweet: Restock quantity must be greater than 0"
    );
    await expect(restockSweet(sweetId, -5)).rejects.toThrow(
      "Failed to restock sweet: Restock quantity must be greater than 0"
    );
  });

  it("should throw error when database operation fails", async () => {
    const sweetId = "mock-id-123";
    Sweet.findById = jest.fn().mockRejectedValue(new Error("Database error"));

    await expect(restockSweet(sweetId, 15)).rejects.toThrow(
      "Failed to restock sweet: Database error"
    );
  });
  it("should throw error for non-integer restock quantity", async () => {
    const sweetId = "mock-id-123";
    await expect(restockSweet(sweetId, 2.5)).rejects.toThrow(
      "Failed to restock sweet: Quantity must be a positive integer"
    );
  });
});
