import searchSweets from "../../src/services/searchSweets.js";
import Sweet from "../../src/models/Sweet";

jest.mock("../../src/models/Sweet");

describe("searchSweets", () => {
  it("should search sweets by name", async () => {
    const searchCriteria = { name: "Chocolate" };
    const mockSweets = [
      {
        _id: "1",
        name: "Chocolate Bar",
        category: "Chocolate",
        price: 2.5,
        quantity: 10,
      },
    ];

    Sweet.find = jest.fn().mockResolvedValue(mockSweets);

    const result = await searchSweets(searchCriteria);

    expect(result).toEqual(mockSweets);
    expect(Sweet.find).toHaveBeenCalledWith({
      name: { $regex: "Chocolate", $options: "i" },
    });
  });

  it("should search sweets by category", async () => {
    const searchCriteria = { category: "Chocolate" };
    const mockSweets = [
      {
        _id: "1",
        name: "Chocolate Bar",
        category: "Chocolate",
        price: 2.5,
        quantity: 10,
      },
    ];

    Sweet.find = jest.fn().mockResolvedValue(mockSweets);

    const result = await searchSweets(searchCriteria);

    expect(result).toEqual(mockSweets);
    expect(Sweet.find).toHaveBeenCalledWith({ category: "Chocolate" });
  });

  it("should search sweets by price range", async () => {
    const searchCriteria = { minPrice: 2.0, maxPrice: 5.0 };
    const mockSweets = [
      {
        _id: "1",
        name: "Chocolate Bar",
        category: "Chocolate",
        price: 2.5,
        quantity: 10,
      },
    ];

    Sweet.find = jest.fn().mockResolvedValue(mockSweets);

    const result = await searchSweets(searchCriteria);

    expect(result).toEqual(mockSweets);
    expect(Sweet.find).toHaveBeenCalledWith({
      price: { $gte: 2.0, $lte: 5.0 },
    });
  });

  it("should search sweets by multiple criteria", async () => {
    const searchCriteria = {
      name: "Chocolate",
      category: "Chocolate",
      minPrice: 2.0,
      maxPrice: 5.0,
    };
    const mockSweets = [
      {
        _id: "1",
        name: "Chocolate Bar",
        category: "Chocolate",
        price: 2.5,
        quantity: 10,
      },
    ];

    Sweet.find = jest.fn().mockResolvedValue(mockSweets);

    const result = await searchSweets(searchCriteria);

    expect(result).toEqual(mockSweets);
    expect(Sweet.find).toHaveBeenCalledWith({
      name: { $regex: "Chocolate", $options: "i" },
      category: "Chocolate",
      price: { $gte: 2.0, $lte: 5.0 },
    });
  });

  it("should return empty array when no matches found", async () => {
    const searchCriteria = { name: "NonExistent" };
    Sweet.find = jest.fn().mockResolvedValue([]);

    const result = await searchSweets(searchCriteria);

    expect(result).toEqual([]);
  });

  it("should throw error when database operation fails", async () => {
    const searchCriteria = { name: "Chocolate" };
    Sweet.find = jest.fn().mockRejectedValue(new Error("Database error"));

    await expect(searchSweets(searchCriteria)).rejects.toThrow(
      "Failed to search sweets: Database error"
    );
  });
  
  it("should throw error for invalid category", async () => {
    const searchCriteria = { category: "invalid-category" };

    await expect(searchSweets(searchCriteria)).rejects.toThrow(
      "Failed to search sweets: Invalid category"
    );
  });

  it("should throw error for negative minPrice", async () => {
    const searchCriteria = { minPrice: -10 };

    await expect(searchSweets(searchCriteria)).rejects.toThrow(
      "Failed to search sweets: Price must be non-negative"
    );
  });

  it("should throw error for negative maxPrice", async () => {
    const searchCriteria = { maxPrice: -5 };

    await expect(searchSweets(searchCriteria)).rejects.toThrow(
      "Failed to search sweets: Price must be non-negative"
    );
  });
});
