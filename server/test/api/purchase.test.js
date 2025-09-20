import request from "supertest";
import app from "../../src/app.js";
import Sweet from "../../src/models/Sweet.js";
import { generateUserToken } from "../../src/helper/helpers.js";

describe("POST /api/sweets/:id/purchase", () => {
  let userToken;

  beforeAll(() => {
    userToken = generateUserToken(); // any authenticated user
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
        quantity: 5,
      },
      {
        _id: "507f1f77bcf86cd799439013",
        name: "Out of Stock Sweet",
        category: "Pastry",
        price: 3.0,
        quantity: 0,
      },
    ]);
  });

  it("should allow authenticated user to purchase sweet", async () => {
    const sweetId = "507f1f77bcf86cd799439011";
    const purchaseData = { quantity: 3 };

    const response = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(purchaseData)
      .expect(200);

    expect(response.body.sweet._id).toBe(sweetId);
    expect(response.body.sweet.quantity).toBe(7);
    expect(response.body.purchasedQuantity).toBe(3);
    expect(response.body.remainingQuantity).toBe(7);
  });

  it("should return 401 Unauthorized if no token is provided", async () => {
    const sweetId = "507f1f77bcf86cd799439011";
    const purchaseData = { quantity: 1 };

    const response = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .send(purchaseData)
      .expect(401);

    expect(response.body.error).toBe("Unauthorized");
  });

  it("should successfully purchase sweet when sufficient stock is available", async () => {
    const sweetId = "507f1f77bcf86cd799439011";
    const purchaseData = { quantity: 3 };

    const response = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(purchaseData)
      .expect(200);

    expect(response.body.sweet._id).toBe(sweetId);
    expect(response.body.sweet.name).toBe("Chocolate Bar");
    expect(response.body.sweet.quantity).toBe(7); // 10 - 3 = 7
    expect(response.body.purchasedQuantity).toBe(3);
    expect(response.body.remainingQuantity).toBe(7);

    // Verify the database was updated
    const updatedSweet = await Sweet.findById(sweetId);
    expect(updatedSweet.quantity).toBe(7);
  });

  it("should purchase entire remaining stock", async () => {
    const sweetId = "507f1f77bcf86cd799439012";
    const purchaseData = { quantity: 5 };

    const response = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(purchaseData)
      .expect(200);

    expect(response.body.sweet.quantity).toBe(0);
    expect(response.body.purchasedQuantity).toBe(5);
    expect(response.body.remainingQuantity).toBe(0);

    // Verify the database was updated
    const updatedSweet = await Sweet.findById(sweetId);
    expect(updatedSweet.quantity).toBe(0);
  });

  it("should return 404 when sweet is not found", async () => {
    const nonExistentId = "507f1f77bcf86cd799439999";
    const purchaseData = { quantity: 1 };

    const response = await request(app)
      .post(`/api/sweets/${nonExistentId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(purchaseData)
      .expect(404);

    expect(response.body.error).toBe(
      "Failed to purchase sweet: Sweet not found"
    );
  });

  it("should return 400 for invalid sweet ID format", async () => {
    const invalidId = "invalid-id";
    const purchaseData = { quantity: 1 };

    const response = await request(app)
      .post(`/api/sweets/${invalidId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(purchaseData)
      .expect(400);

    expect(response.body.error).toContain("Invalid sweet ID");
  });

  it("should return 400 when insufficient stock is available", async () => {
    const sweetId = "507f1f77bcf86cd799439011";
    const purchaseData = { quantity: 15 };

    const response = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(purchaseData)
      .expect(400);

    expect(response.body.error).toBe(
      "Failed to purchase sweet: Insufficient stock available"
    );

    const sweet = await Sweet.findById(sweetId);
    expect(sweet.quantity).toBe(10);
  });

  it("should return 400 when trying to purchase from out of stock sweet", async () => {
    const sweetId = "507f1f77bcf86cd799439013";
    const purchaseData = { quantity: 1 };

    const response = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(purchaseData)
      .expect(400);

    expect(response.body.error).toBe(
      "Failed to purchase sweet: Insufficient stock available"
    );
  });

  it("should return 400 when purchase quantity is zero", async () => {
    const sweetId = "507f1f77bcf86cd799439011";
    const purchaseData = { quantity: 0 };

    const response = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(purchaseData)
      .expect(400);

    expect(response.body.error).toBe(
      "Failed to purchase sweet: Purchase quantity must be greater than 0"
    );
  });

  it("should return 400 when purchase quantity is negative", async () => {
    const sweetId = "507f1f77bcf86cd799439011";
    const purchaseData = { quantity: -5 };

    const response = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(purchaseData)
      .expect(400);

    expect(response.body.error).toBe(
      "Failed to purchase sweet: Purchase quantity must be greater than 0"
    );
  });

  it("should return 400 when quantity is not a number", async () => {
    const sweetId = "507f1f77bcf86cd799439011";
    const purchaseData = { quantity: "invalid" };

    const response = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(purchaseData)
      .expect(400);

    expect(response.body.error).toBe(
      "Purchase quantity must be a valid number"
    );
  });

  it("should return 400 when quantity is missing", async () => {
    const sweetId = "507f1f77bcf86cd799439011";
    const purchaseData = {}; // No quantity field

    const response = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(purchaseData)
      .expect(400);

    expect(response.body.error).toBe("Purchase quantity is required");
  });

  it("should return 400 when quantity is not an integer", async () => {
    const sweetId = "507f1f77bcf86cd799439011";
    const purchaseData = { quantity: 2.5 };

    const response = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(purchaseData)
      .expect(400);

    expect(response.body.error).toBe(
      "Purchase quantity must be a whole number"
    );
  });

  it("should handle database errors gracefully", async () => {
    const sweetId = "507f1f77bcf86cd799439011";
    const purchaseData = { quantity: 1 };

    const originalFindById = Sweet.findById;
    Sweet.findById = jest
      .fn()
      .mockRejectedValue(new Error("Database connection failed"));

    const response = await request(app)
      .post(`/api/sweets/${sweetId}/purchase`)
      .set("Authorization", `Bearer ${userToken}`)
      .send(purchaseData)
      .expect(500);

    expect(response.body.error).toBe(
      "Failed to purchase sweet: Database connection failed"
    );

    Sweet.findById = originalFindById;
  });
});
