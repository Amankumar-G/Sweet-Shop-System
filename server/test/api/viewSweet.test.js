import request from 'supertest';
import app from '../../src/app.js';
import Sweet from '../../src/models/Sweet.js';
import { generateAdminToken, generateUserToken } from '../../src/helper/helpers.js';

describe('GET /api/sweets', () => {
  let adminToken;
  let userToken;

  beforeAll(() => {
    adminToken = generateAdminToken();
    userToken = generateUserToken();
  });

  beforeEach(async () => {
    await Sweet.deleteMany();
  });

  it('should return all sweets when data exists (admin)', async () => {
    await Sweet.insertMany([
      { name: 'Ladoo', category: 'Milk-Based', price: 10, quantity: 50 },
      { name: 'Barfi', category: 'Milk-Based', price: 15, quantity: 30 },
    ]);

    const response = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.length).toBe(2);
    expect(response.body[0].name).toBe('Ladoo');
  });

  it('should return all sweets when data exists (normal user)', async () => {
    await Sweet.insertMany([
      { name: 'Gulab Jamun', category: 'Milk-Based', price: 20, quantity: 40 },
    ]);

    const response = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('Gulab Jamun');
  });

  it('should return empty array when no sweets exist', async () => {
    const response = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200);

    expect(response.body).toEqual([]);
  });

  it('should return 500 if DB fails', async () => {
    jest.spyOn(Sweet, 'find').mockRejectedValue(new Error('Database error'));

    const response = await request(app)
      .get('/api/sweets')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(500);

    expect(response.body.error).toBe('Failed to retrieve sweets: Database error');

    // Restore mocked method
    Sweet.find.mockRestore();
  });

  it('should return 401 Unauthorized if no token is provided', async () => {
    await request(app).get('/api/sweets').expect(401);
  });
});
