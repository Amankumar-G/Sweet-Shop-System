import { registerUser } from "../../src/services/registration.js";
import User from "../../src/models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../../src/models/User.js");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("Registration Service - Unit Tests", () => {
  describe("registerUser", () => {
    it("should successfully register a new user with valid data", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        role: "customer",
      };

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

      const result = await registerUser(userData);

      expect(result).toHaveProperty("token", "mock-jwt-token");
      expect(result).toHaveProperty("user");
      expect(result.user).toHaveProperty("username", "testuser");
      expect(result.user).toHaveProperty("email", "test@example.com");
      expect(result.user).toHaveProperty("role", "customer");
      expect(User.prototype.save).toHaveBeenCalledTimes(1);
    });

    it("should throw error if email already exists", async () => {
      const userData = {
        username: "testuser",
        email: "existing@example.com",
        password: "password123",
      };

      const existingUser = {
        _id: "existing-user-id",
        email: "existing@example.com",
        username: "existinguser",
      };

      User.findByEmail.mockResolvedValue(existingUser);

      await expect(registerUser(userData)).rejects.toThrow(
        "User with this email already exists"
      );
    });

    it("should throw error if username already exists", async () => {
      const userData = {
        username: "existinguser",
        email: "test@example.com",
        password: "password123",
      };

      User.findByEmail.mockResolvedValue(null);
      User.findOne.mockResolvedValue({ username: "existinguser" });

      await expect(registerUser(userData)).rejects.toThrow(
        "Username is already taken"
      );
    });

    it("should throw error for invalid email format", async () => {
      const userData = {
        username: "testuser",
        email: "invalid-email",
        password: "password123",
      };

      await expect(registerUser(userData)).rejects.toThrow(
        "Please provide a valid email address"
      );
    });

    it("should throw error for short username", async () => {
      const userData = {
        username: "ab",
        email: "test@example.com",
        password: "password123",
      };

      await expect(registerUser(userData)).rejects.toThrow(
        "Username must be at least 3 characters long"
      );
    });

    it("should throw error for long username", async () => {
      const userData = {
        username: "a".repeat(31),
        email: "test@example.com",
        password: "password123",
      };

      await expect(registerUser(userData)).rejects.toThrow(
        "Username cannot exceed 30 characters"
      );
    });

    it("should throw error for short password", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "short",
      };

      await expect(registerUser(userData)).rejects.toThrow(
        "Password must be at least 6 characters long"
      );
    });

    it("should throw error for missing required fields", async () => {
      const userData = {
        username: "testuser",
        // email missing
        password: "password123",
      };

      await expect(registerUser(userData)).rejects.toThrow("Email is required");
    });

    it("should handle database validation errors", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      User.findByEmail.mockResolvedValue(null);
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedPassword123");

      const validationError = new Error("Validation failed");
      validationError.name = "ValidationError";
      validationError.errors = {
        username: { message: "Username is required" },
        email: { message: "Email is invalid" },
      };

      User.prototype.save = jest.fn().mockRejectedValue(validationError);

      await expect(registerUser(userData)).rejects.toThrow(
        "Validation failed: Username is required, Email is invalid"
      );
    });

    it("should handle unexpected errors during user creation", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
      };

      User.findByEmail.mockResolvedValue(null);
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedPassword123");

      const dbError = new Error("Database connection failed");
      User.prototype.save = jest.fn().mockRejectedValue(dbError);

      await expect(registerUser(userData)).rejects.toThrow(
        "Database connection failed"
      );
    });

    it("should register user with default customer role when not specified", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        // role not specified
      };

      const mockUser = {
        _id: "user-id-123",
        username: "testuser",
        email: "test@example.com",
        password: "hashedPassword123",
        role: "customer", // default role
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      User.findByEmail.mockResolvedValue(null);
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedPassword123");
      User.prototype.save = jest.fn().mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue("mock-jwt-token");

      const result = await registerUser(userData);

      expect(result.user.role).toBe("customer");
    });

    it("should register user with admin role when specified", async () => {
      const userData = {
        username: "adminuser",
        email: "admin@example.com",
        password: "adminpassword123",
        role: "admin",
      };

      const mockUser = {
        _id: "admin-id-123",
        username: "adminuser",
        email: "admin@example.com",
        password: "hashedPassword123",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      User.findByEmail.mockResolvedValue(null);
      User.findOne.mockResolvedValue(null);
      bcrypt.hash.mockResolvedValue("hashedPassword123");
      User.prototype.save = jest.fn().mockResolvedValue(mockUser);
      jwt.sign.mockReturnValue("mock-jwt-token");

      const result = await registerUser(userData);

      expect(result.user.role).toBe("admin");
    });

    it("should throw error for invalid role", async () => {
      const userData = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        role: "invalid-role",
      };

      await expect(registerUser(userData)).rejects.toThrow("Invalid role");
    });
  });
});
