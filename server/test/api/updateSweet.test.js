import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app.js";
import Sweet from "../../src/models/Sweet.js";
import { generateAdminToken, generateUserToken } from "../../src/helper/helpers.js";

describe("PUT /api/sweets/:id", () => {
  let sweet;
  let adminToken;
  let userToken;

  beforeAll(() => {
    adminToken = generateAdminToken();
    userToken = generateUserToken();
  });

  beforeEach(async () => {
    sweet = await Sweet.create({
      name: "Rasgulla",
      category: "Milk-Based",
      price: 20,
      quantity: 25,
    });
  });

  afterEach(async () => {
    await Sweet.deleteMany({});
  });

  it("should update an existing sweet as an admin", async () => {
    const response = await request(app)
      .put(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 30, quantity: 50 })
      .expect(200);

    expect(response.body.price).toBe(30);
    expect(response.body.quantity).toBe(50);

    const updatedSweet = await Sweet.findById(sweet._id);
    expect(updatedSweet.price).toBe(30);
    expect(updatedSweet.quantity).toBe(50);
  });

  it("should return 404 if sweet is not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .put(`/api/sweets/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 100 })
      .expect(404);

    expect(response.body.error).toBe("Failed to update sweet: Sweet not found");
  });

  it("should return 400 for invalid MongoDB ObjectId", async () => {
    const response = await request(app)
      .put("/api/sweets/invalid-id")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: 50 })
      .expect(400);

    expect(response.body.error).toBe("Invalid sweet ID");
  });

  it("should return 400 for invalid update data", async () => {
    const response = await request(app)
      .put(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ price: -10 }) // invalid price
      .expect(400);

    expect(response.body.error).toBeDefined();
  });

  it("should return 403 Forbidden for a non-admin user", async () => {
    const response = await request(app)
      .put(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ price: 35 })
      .expect(403);

    expect(response.body.error).toBe("Admin access required");
  });

  it("should return 401 Unauthorized if no token is provided", async () => {
    await request(app)
      .put(`/api/sweets/${sweet._id}`)
      .send({ price: 40 })
      .expect(401);
  });
});
