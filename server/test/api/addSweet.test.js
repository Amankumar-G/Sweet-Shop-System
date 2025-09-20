import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../../src/app.js";
import Sweet from "../../src/models/Sweet.js";
import { generateAdminToken, generateUserToken } from "../../src/helper/helpers.js";

// The JWT_SECRET will be loaded from the .env file by our Jest setup
const JWT_SECRET = process.env.JWT_SECRET;

describe("POST /api/sweets", () => {
  let adminToken;
  let userToken;

  // beforeAll runs once before all tests in this describe block
  beforeAll(() => {
    adminToken = generateAdminToken();
    userToken = generateUserToken();

  });
  
  it("should add a sweet with valid data as an admin", async () => {
    const newSweet = {
      name: "Ladoo",
      category: "Vegetable-Based",
      price: 15,
      quantity: 20,
      description: "Delicious Indian sweet",
    };
    
    const response = await request(app)
      .post("/api/sweets")
      .set('Authorization', `Bearer ${adminToken}`)
      .send(newSweet)
      .expect(201);

    expect(response.body.name).toBe(newSweet.name);
    expect(response.body.category).toBe(newSweet.category);

    // Clean up the created sweet to keep tests independent
    const sweetInDB = await Sweet.findOne({ name: "Ladoo" });
    expect(sweetInDB).toBeTruthy();
    await Sweet.deleteOne({ _id: sweetInDB._id });
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
      .set('Authorization', `Bearer ${adminToken}`)
      .send(invalidSweet)
      .expect(400);

    expect(response.body.error).toBeDefined();
  });

  it("should fail if required fields are missing", async () => {
    const response = await request(app)
      .post("/api/sweets")
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ name: "Barfi" })
      .expect(400);

    expect(response.body.error).toBeDefined();
  });

  it("should fail if price is not a number", async () => {
    const response = await request(app)
      .post("/api/sweets")
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: "Jalebi",
        category: "indian",
        price: "free",
        quantity: 5,
      })
      .expect(400);

    expect(response.body.error).toBeDefined();
  });

  // Test for non-admin and unauthorized access
  it("should return 403 Forbidden for a non-admin user", async () => {
    const newSweet = { name: "Rasgulla", price: 10, quantity: 50, category: 'Milk-Based' };

    const response = await request(app)
      .post("/api/sweets")
      .set('Authorization', `Bearer ${userToken}`) // Use the non-admin token
      .send(newSweet)
      .expect(403);

    expect(response.body.error).toBe('Admin access required');
  });

  it("should return 401 Unauthorized if no token is provided", async () => {
    const newSweet = { name: "Gulab Jamun", price: 12, quantity: 30, category: 'Milk-Based' };
    
    await request(app)
      .post("/api/sweets")
      // No .set('Authorization', ...) here
      .send(newSweet)
      .expect(401);
  });
});
