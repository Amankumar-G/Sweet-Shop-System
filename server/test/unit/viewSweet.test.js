import viewAllSweets from "../../src/services/viewAllSweets.js";
import Sweet from "../../src/models/Sweet";

jest.mock("../../src/models/Sweet");

describe("viewAllSweets - Unit Test", () => {
  it("should return all sweets successfully", async () => {
    const mockSweets = [
      {
        _id: "1",
        name: "Chocolate Bar",
        category: "Chocolate",
        price: 2.5,
        quantity: 10,
      },
      {
        _id: "2",
        name: "Gummy Bears",
        category: "Candy",
        price: 1.5,
        quantity: 20,
      },
    ];

    Sweet.find = jest.fn().mockResolvedValue(mockSweets);

    const result = await viewAllSweets();

    expect(result).toEqual(mockSweets);
    expect(Sweet.find).toHaveBeenCalledWith();
  });

  it("should return empty array when no sweets exist", async () => {
    Sweet.find = jest.fn().mockResolvedValue([]);

    const result = await viewAllSweets();

    expect(result).toEqual([]);
  });

  it("should throw error when database operation fails", async () => {
    Sweet.find = jest.fn().mockRejectedValue(new Error("Database error"));

    await expect(viewAllSweets()).rejects.toThrow(
      "Failed to retrieve sweets: Database error"
    );
  });
});
