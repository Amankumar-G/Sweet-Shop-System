import deleteSweet from "../../src/services/deleteSweet.js";
import Sweet from "../../src/models/Sweet";

jest.mock("../../src/models/Sweet");

describe("deleteSweet", () => {
  it("should successfully delete an existing sweet", async () => {
    const sweetId = "mock-id-123";
    const mockDeletedSweet = {
      _id: sweetId,
      name: "Chocolate Bar",
      category: "Chocolate",
      price: 2.5,
      quantity: 10,
    };

    Sweet.findByIdAndDelete = jest.fn().mockResolvedValue(mockDeletedSweet);

    const result = await deleteSweet(sweetId);

    expect(result).toEqual(mockDeletedSweet);
    expect(Sweet.findByIdAndDelete).toHaveBeenCalledWith(sweetId);
  });

  it("should throw error when sweet is not found", async () => {
    const sweetId = "non-existent-id";
    Sweet.findByIdAndDelete = jest.fn().mockResolvedValue(null);

    await expect(deleteSweet(sweetId)).rejects.toThrow(
      "Failed to delete sweet: Sweet not found"
    );
  });

  it("should throw error when database operation fails", async () => {
    const sweetId = "mock-id-123";
    Sweet.findByIdAndDelete = jest
      .fn()
      .mockRejectedValue(new Error("Database error"));

    await expect(deleteSweet(sweetId)).rejects.toThrow(
      "Failed to delete sweet: Database error"
    );
  });
});
