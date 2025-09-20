import { loginUser } from "../../src/services/login.js";
import User from "../../src/models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../../src/models/User.js");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Login Service - Unit Tests", () => {
  // Helper to create a mock Mongoose user
  const createMockUser = (overrides = {}) => {
    const user = {
      _id: "user-id-123",
      username: "testuser",
      email: "test@example.com",
      password: "hashedPassword123",
      role: "customer",
      comparePassword: jest.fn().mockResolvedValue(true),
    };

    user.toObject = jest.fn().mockReturnValue({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...overrides.toObject,
    });

    return { ...user, ...overrides };
  };

  describe("loginUser", () => {
    it("should successfully login a user with valid credentials", async () => {
      const loginData = { email: "test@example.com", password: "password123" };
      const mockUser = createMockUser();

      User.findByEmail.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue("mock-jwt-token");

      const result = await loginUser(loginData);

      expect(result).toHaveProperty("token", "mock-jwt-token");
      expect(result.user).toMatchObject({
        username: "testuser",
        email: "test@example.com",
        role: "customer",
      });
      expect(mockUser.comparePassword).toHaveBeenCalledWith("password123");
    });

    it("should throw error if email is missing", async () => {
      const loginData = { password: "password123" };
      await expect(loginUser(loginData)).rejects.toThrow(
        "Email and password are required"
      );
    });

    it("should throw error if password is missing", async () => {
      const loginData = { email: "test@example.com" };
      await expect(loginUser(loginData)).rejects.toThrow(
        "Email and password are required"
      );
    });

    it("should throw error if email format is invalid", async () => {
      const loginData = { email: "invalid-email", password: "password123" };
      await expect(loginUser(loginData)).rejects.toThrow(
        "Please provide a valid email address"
      );
    });

    it("should throw error if user with email does not exist", async () => {
      User.findByEmail.mockResolvedValue(null);
      await expect(
        loginUser({ email: "nonexistent@example.com", password: "pass" })
      ).rejects.toThrow("Invalid email or password");
    });

    it("should throw error for incorrect password", async () => {
      const mockUser = createMockUser({
        comparePassword: jest.fn().mockResolvedValue(false),
      });
      User.findByEmail.mockResolvedValue(mockUser);

      await expect(
        loginUser({ email: "test@example.com", password: "wrongpassword" })
      ).rejects.toThrow("Invalid email or password");
    });

    it("should handle database errors during user lookup", async () => {
      const dbError = new Error("Database connection failed");
      User.findByEmail.mockRejectedValue(dbError);

      await expect(
        loginUser({ email: "test@example.com", password: "password123" })
      ).rejects.toThrow("Database connection failed");
    });

    it("should handle errors during password comparison", async () => {
      const mockUser = createMockUser({
        comparePassword: jest.fn().mockRejectedValue(new Error("Bcrypt error")),
      });
      User.findByEmail.mockResolvedValue(mockUser);

      await expect(
        loginUser({ email: "test@example.com", password: "password123" })
      ).rejects.toThrow("Bcrypt error");
    });

    it("should handle JWT token generation errors", async () => {
      const mockUser = createMockUser();
      User.findByEmail.mockResolvedValue(mockUser);
      jwt.sign.mockImplementation(() => {
        throw new Error("JWT generation failed");
      });

      await expect(
        loginUser({ email: "test@example.com", password: "password123" })
      ).rejects.toThrow("JWT generation failed");
    });

    it("should login user with admin role successfully", async () => {
      const mockUser = createMockUser({
        _id: "admin-id-123",
        username: "adminuser",
        email: "admin@example.com",
        role: "admin",
        toObject: jest.fn().mockReturnValue({
          _id: "admin-id-123",
          username: "adminuser",
          email: "admin@example.com",
          role: "admin",
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      });

      User.findByEmail.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue("mock-jwt-token");

      const result = await loginUser({
        email: "admin@example.com",
        password: "adminpassword123",
      });

      expect(result.user.role).toBe("admin");
      expect(result).toHaveProperty("token", "mock-jwt-token");
    });

    it("should return user data without password field", async () => {
      const mockUser = createMockUser();
      User.findByEmail.mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue("mock-jwt-token");

      const result = await loginUser({
        email: "test@example.com",
        password: "password123",
      });

      expect(result.user).not.toHaveProperty("password");
      expect(result.user).toHaveProperty("username");
      expect(result.user).toHaveProperty("email");
      expect(result.user).toHaveProperty("role");
    });
  });
});
