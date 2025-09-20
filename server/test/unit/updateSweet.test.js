import updateSweet from "../../src/services/updateSweet.js";
import Sweet from "../../src/models/Sweet.js";

jest.mock("../../src/models/Sweet");

describe("updateSweet - Unit Test", () => {

  it("should successfully update an existing sweet", async () => {
    const sweetId = "mock-id-123";
    const updateData = {
      name: "Updated Chocolate Bar",
      price: 3.0,
      quantity: 15,
    };

    const mockUpdatedSweet = {
      _id: sweetId,
      name: "Updated Chocolate Bar",
      category: "Chocolate",
      price: 3.0,
      quantity: 15,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    Sweet.findByIdAndUpdate = jest.fn().mockResolvedValue(mockUpdatedSweet);

    const result = await updateSweet(sweetId, updateData);

    expect(result).toEqual(mockUpdatedSweet);
    expect(Sweet.findByIdAndUpdate).toHaveBeenCalledWith(
      sweetId,
      { $set: updateData },
      { new: true, runValidators: true }
    );
  });

  it("should throw error if sweet does not exist", async () => {
    const sweetId = "non-existent-id";
    const updateData = { price: 5.0 };

    Sweet.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

    await expect(updateSweet(sweetId, updateData)).rejects.toThrow(
      "Failed to update sweet: Sweet not found"
    );
  });

  it("should throw validation error for invalid data", async () => {
    const sweetId = "mock-id-123";
    const updateData = { price: -2.0 };

    const validationError = new Error("Price must be positive");
    validationError.name = "ValidationError";
    Sweet.findByIdAndUpdate = jest.fn().mockRejectedValue(validationError);

    await expect(updateSweet(sweetId, updateData)).rejects.toThrow(
      "Price must be positive"
    );
  });

  it("should throw error for database failure", async () => {
    const sweetId = "mock-id-123";
    const updateData = { quantity: 20 };

    Sweet.findByIdAndUpdate = jest.fn().mockRejectedValue(new Error("DB error"));

    await expect(updateSweet(sweetId, updateData)).rejects.toThrow(
      "Failed to update sweet: DB error"
    );
  });

});
    