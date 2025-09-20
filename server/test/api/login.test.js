// tests/authIntegration.test.js
import request from 'supertest';
import app from '../../src/app.js';
import User from '../../src/models/User.js';
import bcrypt from 'bcryptjs';

jest.mock('../../src/models/User.js');
jest.mock('bcryptjs');

describe('Auth Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/login', () => {
    it('should login successfully and return JWT token', async () => {
      const mockUser = {
        _id: 'user-id-123',
        username: 'testuser',
        email: 'test@example.com',
        password: 'hashedPassword123',
        role: 'customer',
        comparePassword: jest.fn().mockResolvedValue(true),
        toObject: () => ({
          _id: 'user-id-123',
          username: 'testuser',
          email: 'test@example.com',
          role: 'customer',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      };

      User.findByEmail.mockResolvedValue(mockUser);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user).toHaveProperty('email', 'test@example.com');
    });

    it('should return 401 for invalid credentials', async () => {
      User.findByEmail.mockResolvedValue(null);

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid email or password');
    });
  });
});