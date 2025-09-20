import request from "supertest";
import app from "../../src/app.js";
import Sweet from "../../src/models/Sweet.js";
import {
  generateAdminToken,
  generateUserToken,
} from "../../src/helper/helpers.js";

describe("PUT /api/sweets/:id/restock", () => {
  let adminToken;
  let userToken;

  beforeAll(() => {
    adminToken = generateAdminToken(); // for admin
    userToken = generateUserToken(); // for regular user
  });

  beforeEach(async () => {
    await Sweet.deleteMany();

    await Sweet.insertMany([
      {
        _id: "507f1f77bcf86cd799439011",
        name: "Chocolate Bar",
        category: "Chocolate",
        price: 2.5,
        quantity: 10,
      },
      {
        _id: "507f1f77bcf86cd799439012",
        name: "Candy Stick",
        category: "Candy",
        price: 1.0,
        quantity: 0,
      },
      {
        _id: "507f1f77bcf86cd799439013",
        name: "Pastry Roll",
        category: "Pastry",
        price: 3.0,
        quantity: 5,
      },
    ]);
  });

  it("should return 401 if no token is provided", async () => {
    const sweetId = "507f1f77bcf86cd799439011";
    const restockData = { quantity: 10 };

    const response = await request(app)
      .put(`/api/sweets/${sweetId}/restock`)
      .send(restockData)
      .expect(401);

    expect(response.body.error).toBe("Unauthorized");
  });

  it("should return 403 if a non-admin user tries to restock", async () => {
    const sweetId = "507f1f77bcf86cd799439011";
    const restockData = { quantity: 10 };

    const response = await request(app)
      .put(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(restockData)
      .expect(403);

    expect(response.body.error).toBe("Admin access required");
  });

  it("should successfully restock sweet with existing inventory", async () => {
    const sweetId = "507f1f77bcf86cd799439011";
    const restockData = { quantity: 15 };

    const response = await request(app)
      .put(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(restockData)
      .expect(200);

    expect(response.body.sweet._id).toBe(sweetId);
    expect(response.body.sweet.name).toBe("Chocolate Bar");
    expect(response.body.sweet.quantity).toBe(25); // 10 + 15 = 25
    expect(response.body.restockedQuantity).toBe(15);
    expect(response.body.newQuantity).toBe(25);

    // Verify the database was updated
    const updatedSweet = await Sweet.findById(sweetId);
    expect(updatedSweet.quantity).toBe(25);
  });

  it("should successfully restock out of stock sweet", async () => {
    const sweetId = "507f1f77bcf86cd799439012";
    const restockData = { quantity: 20 };

    const response = await request(app)
      .put(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(restockData)
      .expect(200);

    expect(response.body.sweet._id).toBe(sweetId);
    expect(response.body.sweet.name).toBe("Candy Stick");
    expect(response.body.sweet.quantity).toBe(20); // 0 + 20 = 20
    expect(response.body.restockedQuantity).toBe(20);
    expect(response.body.newQuantity).toBe(20);

    // Verify the database was updated
    const updatedSweet = await Sweet.findById(sweetId);
    expect(updatedSweet.quantity).toBe(20);
  });

  it("should successfully restock with quantity 1", async () => {
    const sweetId = "507f1f77bcf86cd799439013";
    const restockData = { quantity: 1 };

    const response = await request(app)
      .put(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(restockData)
      .expect(200);

    expect(response.body.sweet.quantity).toBe(6); // 5 + 1 = 6
    expect(response.body.restockedQuantity).toBe(1);
    expect(response.body.newQuantity).toBe(6);

    // Verify the database was updated
    const updatedSweet = await Sweet.findById(sweetId);
    expect(updatedSweet.quantity).toBe(6);
  });

  it("should return 404 when sweet is not found", async () => {
    const nonExistentId = "507f1f77bcf86cd799439999";
    const restockData = { quantity: 10 };

    const response = await request(app)
      .put(`/api/sweets/${nonExistentId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(restockData)
      .expect(404);

    expect(response.body.error).toBe(
      "Failed to restock sweet: Sweet not found"
    );
  });

  it("should return 400 for invalid sweet ID format", async () => {
    const invalidId = "invalid-id";
    const restockData = { quantity: 10 };

    const response = await request(app)
      .put(`/api/sweets/${invalidId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(restockData)
      .expect(400);

    expect(response.body.error).toBe("Invalid sweet ID format");
  });

  it("should return 400 when restock quantity is zero", async () => {
    const sweetId = "507f1f77bcf86cd799439011";
    const restockData = { quantity: 0 };

    const response = await request(app)
      .put(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(restockData)
      .expect(400);

    expect(response.body.error).toBe(
      "Failed to restock sweet: Restock quantity must be greater than 0"
    );

    // Verify the database was not updated
    const sweet = await Sweet.findById(sweetId);
    expect(sweet.quantity).toBe(10); // Should remain unchanged
  });

  it("should return 400 when restock quantity is negative", async () => {
    const sweetId = "507f1f77bcf86cd799439011";
    const restockData = { quantity: -5 };

    const response = await request(app)
      .put(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(restockData)
      .expect(400);

    expect(response.body.error).toBe(
      "Failed to restock sweet: Restock quantity must be greater than 0"
    );

    // Verify the database was not updated
    const sweet = await Sweet.findById(sweetId);
    expect(sweet.quantity).toBe(10); // Should remain unchanged
  });

  it("should return 400 when quantity is not a number", async () => {
    const sweetId = "507f1f77bcf86cd799439011";
    const restockData = { quantity: "invalid" };

    const response = await request(app)
      .put(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(restockData)
      .expect(400);

    expect(response.body.error).toBe("Restock quantity must be a valid number");
  });

  it("should return 400 when quantity is missing", async () => {
    const sweetId = "507f1f77bcf86cd799439011";
    const restockData = {}; // No quantity field

    const response = await request(app)
      .put(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(restockData)
      .expect(400);

    expect(response.body.error).toBe("Restock quantity is required");
  });

  it("should return 400 when quantity is not an integer", async () => {
    const sweetId = "507f1f77bcf86cd799439011";
    const restockData = { quantity: 2.5 };

    const response = await request(app)
      .put(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(restockData)
      .expect(400);

    expect(response.body.error).toBe(
      "Failed to restock sweet: Quantity must be a positive integer"
    );

    // Verify the database was not updated
    const sweet = await Sweet.findById(sweetId);
    expect(sweet.quantity).toBe(10); // Should remain unchanged
  });

  it("should return 400 when quantity is null", async () => {
    const sweetId = "507f1f77bcf86cd799439011";
    const restockData = { quantity: null };

    const response = await request(app)
      .put(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(restockData)
      .expect(400);

    expect(response.body.error).toBe("Restock quantity is required");
  });

  it("should return 400 when quantity is undefined", async () => {
    const sweetId = "507f1f77bcf86cd799439011";
    const restockData = { quantity: undefined };

    const response = await request(app)
      .put(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(restockData)
      .expect(400);

    expect(response.body.error).toBe("Restock quantity is required");
  });

  it("should handle large restock quantities", async () => {
    const sweetId = "507f1f77bcf86cd799439011";
    const restockData = { quantity: 1000 };

    const response = await request(app)
      .put(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(restockData)
      .expect(200);

    expect(response.body.sweet.quantity).toBe(1010); // 10 + 1000 = 1010
    expect(response.body.restockedQuantity).toBe(1000);
    expect(response.body.newQuantity).toBe(1010);

    // Verify the database was updated
    const updatedSweet = await Sweet.findById(sweetId);
    expect(updatedSweet.quantity).toBe(1010);
  });

  it("should handle database errors gracefully", async () => {
    const sweetId = "507f1f77bcf86cd799439011";
    const restockData = { quantity: 10 };

    // Mock findById to throw an error
    const originalFindById = Sweet.findById;
    Sweet.findById = jest
      .fn()
      .mockRejectedValue(new Error("Database connection failed"));

    const response = await request(app)
      .put(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(restockData)
      .expect(500);

    expect(response.body.error).toBe(
      "Failed to restock sweet: Database connection failed"
    );

    // Restore original method
    Sweet.findById = originalFindById;
  });

  it("should handle save operation failures", async () => {
    const sweetId = "507f1f77bcf86cd799439011";
    const restockData = { quantity: 10 };

    // Mock save to throw an error
    const originalSave = Sweet.prototype.save;
    Sweet.prototype.save = jest
      .fn()
      .mockRejectedValue(new Error("Save operation failed"));

    const response = await request(app)
      .put(`/api/sweets/${sweetId}/restock`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send(restockData)
      .expect(500);

    expect(response.body.error).toBe(
      "Failed to restock sweet: Save operation failed"
    );

    // Restore original method
    Sweet.prototype.save = originalSave;
  });
});
