import  addSweet from "../../src/services/addSweet.js";
import Sweet from "../../src/models/Sweet";

jest.mock("../../src/models/Sweet");

describe("addSweet - Unit Test", () => {

    it("should successfully add a new sweet with valid data", async () => {
      const sweetData = {
        name: "Chocolate Bar",
        category: "Chocolate",
        price: 2.5,
        quantity: 10,
        description: "Delicious milk chocolate bar",
      };

      const mockSavedSweet = {
        _id: "mock-id-123",
        ...sweetData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      Sweet.prototype.save = jest.fn().mockResolvedValue(mockSavedSweet);

      const result = await addSweet(sweetData);

      expect(result).toEqual(mockSavedSweet);
      expect(Sweet.prototype.save).toHaveBeenCalledTimes(1);
    });

    it("should throw validation error for missing required fields", async () => {
      const invalidSweetData = {
        name: "Chocolate Bar",
      };

      const validationError = new Error("Validation failed");
      validationError.name = "ValidationError";
      Sweet.prototype.save = jest.fn().mockRejectedValue(validationError);

      await expect(addSweet(invalidSweetData)).rejects.toThrow(
        "Validation failed"
      );
    });

    it("should throw error for invalid price (negative value)", async () => {
      const invalidSweetData = {
        name: "Chocolate Bar",
        category: "Chocolate",
        price: -1.0,
        quantity: 10,
      };

      const validationError = new Error("Price must be positive");
      validationError.name = "ValidationError";
      Sweet.prototype.save = jest.fn().mockRejectedValue(validationError);

      await expect(addSweet(invalidSweetData)).rejects.toThrow(
        "Price must be positive"
      );
    });

    it("should throw error for invalid quantity (negative value)", async () => {
      const invalidSweetData = {
        name: "Chocolate Bar",
        category: "Chocolate",
        price: 2.5,
        quantity: -5,
      };

      const validationError = new Error("Quantity cannot be negative");
      validationError.name = "ValidationError";
      Sweet.prototype.save = jest.fn().mockRejectedValue(validationError);

      await expect(addSweet(invalidSweetData)).rejects.toThrow(
        "Quantity cannot be negative"
      );
    });

    it("should throw error for invalid category", async () => {
      const invalidSweetData = {
        name: "Chocolate Bar",
        category: "invalid-category",
        price: 2.5,
        quantity: 10,
      };

      const validationError = new Error("Invalid category");
      validationError.name = "ValidationError";
      Sweet.prototype.save = jest.fn().mockRejectedValue(validationError);

      await expect(addSweet(invalidSweetData)).rejects.toThrow(
        "Invalid category"
      );
    });

    it("should handle empty or whitespace-only name", async () => {
      const invalidSweetData = {
        name: "   ",
        category: "Chocolate",
        price: 2.5,
        quantity: 10,
      };

      const validationError = new Error("Name is required");
      validationError.name = "ValidationError";
      Sweet.prototype.save = jest.fn().mockRejectedValue(validationError);

      await expect(addSweet(invalidSweetData)).rejects.toThrow(
        "Name is required"
      );
    });

    it("should throw error if quantity is zero", async () => {
      const invalidSweetData = {
        name: "Sample Sweet",
        category: "Chocolate",
        price: 5,
        quantity: 0,
      };

      const error = new Error("Quantity must be greater than 0");
      Sweet.prototype.save = jest.fn().mockRejectedValue(error);

      await expect(addSweet(invalidSweetData)).rejects.toThrow(
        "Quantity must be greater than 0"
      );
    });
    it("should throw error if price is zero", async () => {
      const invalidSweetData = {
        name: "Free Sweet",
        category: "Chocolate",
        price: 0,
        quantity: 10,
      };

      const error = new Error("Price must be greater than 0");
      Sweet.prototype.save = jest.fn().mockRejectedValue(error);

      await expect(addSweet(invalidSweetData)).rejects.toThrow(
        "Price must be greater than 0"
      );
    });
  });