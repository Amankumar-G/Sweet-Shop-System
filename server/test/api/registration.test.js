import request from "supertest";
import app from "../../src/app.js";
import User from "../../src/models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../../src/models/User.js");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("POST /api/auth/register - Integration", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 201 and token with user object for valid registration", async () => {
    const newUser = { username: "testuser", email: "test@example.com", password: "password123" };

    const mockUser = {
      _id: "user-id-123",
      username: "testuser",
      email: "test@example.com",
      password: "hashedPassword123",
      role: "customer",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    User.findByEmail.mockResolvedValue(null);
    User.findOne.mockResolvedValue(null);
    bcrypt.hash.mockResolvedValue("hashedPassword123");
    User.prototype.save = jest.fn().mockResolvedValue(mockUser);
    jwt.sign.mockReturnValue("mock-jwt-token");

    const res = await request(app).post("/api/auth/register").send(newUser).expect(201);

    expect(res.body).toHaveProperty("token", "mock-jwt-token");
    expect(res.body.user).toHaveProperty("username", newUser.username);
    expect(res.body.user).toHaveProperty("email", newUser.email);
  });

  it("should return 400 for missing required fields", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "incomplete" }) // email & password missing
      .expect(400);

    expect(res.body.message).toBeDefined();
  });

  it("should return 400 for invalid email format", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ username: "user", email: "bademail", password: "password123" })
      .expect(400);

    expect(res.body.message).toBeDefined();
  });
});
