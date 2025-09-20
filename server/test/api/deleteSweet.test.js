import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app.js";
import Sweet from "../../src/models/Sweet.js";
import { generateAdminToken, generateUserToken } from "../../src/helper/helpers.js";

describe("DELETE /api/sweets/:id", () => {
  let sweet;
  let adminToken;
  let userToken;

  beforeAll(() => {
    adminToken = generateAdminToken();
    userToken = generateUserToken();
  });

  beforeEach(async () => {
    sweet = await Sweet.create({
      name: "Gulab Jamun",
      category: "Milk-Based",
      price: 25,
      quantity: 15,
    });
  });

  afterEach(async () => {
    await Sweet.deleteMany({});
  });

  it("should delete an existing sweet as an admin", async () => {
    const response = await request(app)
      .delete(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body._id).toBe(sweet._id.toString());

    const sweetInDb = await Sweet.findById(sweet._id);
    expect(sweetInDb).toBeNull();
  });

  it("should return 404 if sweet is not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const response = await request(app)
      .delete(`/api/sweets/${fakeId}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(404);

    expect(response.body.error).toBe("Failed to delete sweet: Sweet not found");
  });

  it("should return 400 for invalid MongoDB ObjectId", async () => {
    const response = await request(app)
      .delete("/api/sweets/invalid-id")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(400);

    expect(response.body.error).toBe("Invalid sweet ID");
  });

  it("should return 403 Forbidden for a non-admin user", async () => {
    const response = await request(app)
      .delete(`/api/sweets/${sweet._id}`)
      .set("Authorization", `Bearer ${userToken}`)
      .expect(403);

    expect(response.body.error).toBe("Admin access required");
  });

  it("should return 401 Unauthorized if no token is provided", async () => {
    await request(app)
      .delete(`/api/sweets/${sweet._id}`)
      .expect(401);
  });
});
