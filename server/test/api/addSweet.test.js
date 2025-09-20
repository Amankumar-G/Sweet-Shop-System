import request from "supertest";
import app from "../../src/app.js";
import Sweet from "../../src/models/Sweet.js";
import jwt from "jsonwebtoken";

describe("POST /api/sweets - Authenticated", () => {
  const adminToken = jwt.sign(
    { id: "admin-id-123", role: "admin" },
    process.env.JWT_SECRET || "testsecret"
  );

  it("should add a sweet with valid data when admin", async () => {
    const newSweet = {
      name: "Ladoo",
      category: "Vegetable-Based",
      price: 15,
      quantity: 20,
      description: "Delicious Indian sweet",
    };

    const response = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${adminToken}`)
      .send(newSweet)
      .expect(201);

    expect(response.body.name).toBe(newSweet.name);
    const sweetInDB = await Sweet.findOne({ name: "Ladoo" });
    expect(sweetInDB).toBeTruthy();
  });

  it("should fail if user is not admin", async () => {
    const userToken = jwt.sign(
      { id: "user-id-456", role: "customer" },
      process.env.JWT_SECRET || "testsecret"
    );

    const response = await request(app)
      .post("/api/sweets")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        name: "Barfi",
        category: "Candy",
        price: 10,
        quantity: 5,
      })
      .expect(403);

    expect(response.body.error).toBe("Admin access required");
  });

  it("should add a sweet with valid data", async () => {
    const newSweet = {
      name: "Ladoo",
      category: "Vegetable-Based",
      price: 15,
      quantity: 20,
      description: "Delicious Indian sweet",
    };

    const response = await request(app)
      .post("/api/sweets")
      .send(newSweet)
      .expect(201);

    expect(response.body.name).toBe(newSweet.name);
    expect(response.body.category).toBe(newSweet.category);
    expect(response.body.price).toBe(newSweet.price);
    expect(response.body.quantity).toBe(newSweet.quantity);

    const sweetInDB = await Sweet.findOne({ name: "Ladoo" });
    expect(sweetInDB).toBeTruthy();
  });

  it("should return 400 for invalid sweet data", async () => {
    const invalidSweet = {
      name: "",
      category: "invalid",
      price: -1,
      quantity: -10,
    };

    const response = await request(app)
      .post("/api/sweets")
      .send(invalidSweet)
      .expect(400);

    expect(response.body.error).toBeDefined();
  });
  it("should fail if required fields are missing", async () => {
    const response = await request(app)
      .post("/api/sweets")
      .send({ name: "Barfi" }) // missing price, quantity, etc.
      .expect(400);

    expect(response.body.error).toBeDefined();
  });
  it("should fail if price is not a number", async () => {
    const response = await request(app)
      .post("/api/sweets")
      .send({
        name: "Jalebi",
        category: "indian",
        price: "free",
        quantity: 5,
      })
      .expect(400);

    expect(response.body.error).toBeDefined();
  });
});
