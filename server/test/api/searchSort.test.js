import request from 'supertest';
import app from '../../src/app.js';
import Sweet from '../../src/models/Sweet.js';
import { generateUserToken } from '../../src/helper/helpers.js';

describe('GET /api/sweets/search (integrated search + sort) - Authenticated', () => {
  let userToken;

  beforeAll(() => {
    userToken = generateUserToken();
  });

  beforeEach(async () => {
    await Sweet.deleteMany();

    await Sweet.insertMany([
      {
        name: 'Chocolate Bar',
        category: 'Chocolate',
        price: 5,
        quantity: 50,
      },
      {
        name: 'Candy Stick',
        category: 'Candy',
        price: 2,
        quantity: 20,
      },
      {
        name: 'Pastry Roll',
        category: 'Pastry',
        price: 8,
        quantity: 10,
      },
    ]);
  });

  it('should return sweets filtered by name and sorted by price descending', async () => {
    const response = await request(app)
      .get('/api/sweets/search')
      .set('Authorization', `Bearer ${userToken}`)
      .query({ name: 'c', sortBy: 'price', sortOrder: 'desc' })
      .expect(200);

    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].price).toBeGreaterThanOrEqual(response.body[1].price);
  });

  it('should return sweets filtered by category and price range', async () => {
    const response = await request(app)
      .get('/api/sweets/search')
      .set('Authorization', `Bearer ${userToken}`)
      .query({ category: 'Candy', minPrice: 1, maxPrice: 3 })
      .expect(200);

    expect(response.body.length).toBe(1);
    expect(response.body[0].name).toBe('Candy Stick');
  });

  it('should return 400 for invalid sort field', async () => {
    const response = await request(app)
      .get('/api/sweets/search')
      .set('Authorization', `Bearer ${userToken}`)
      .query({ sortBy: 'invalidField' })
      .expect(400);

    expect(response.body.error).toBe('Failed to sort sweets: Invalid sort field');
  });

  it('should return 400 for invalid category', async () => {
    const response = await request(app)
      .get('/api/sweets/search')
      .set('Authorization', `Bearer ${userToken}`)
      .query({ category: 'invalid-category' })
      .expect(400);

    expect(response.body.error).toBe('Failed to search sweets: Invalid category');
  });

  it('should return 400 for negative minPrice', async () => {
    const response = await request(app)
      .get('/api/sweets/search')
      .set('Authorization', `Bearer ${userToken}`)
      .query({ minPrice: -10 })
      .expect(400);

    expect(response.body.error).toBe('Failed to search sweets: Price must be non-negative');
  });

  it('should return 401 Unauthorized if no token is provided', async () => {
    await request(app)
      .get('/api/sweets/search')
      .query({ name: 'Chocolate' })
      .expect(401);
  });
});
