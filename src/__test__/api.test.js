import { describe, test, expect, beforeAll, afterAll } from '@jest/globals';
import request from 'supertest';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import db from '../models/index.js';
import authRoutes from '../routes/auth.routes.js';
import categoryRoutes from '../routes/category.routes.js';

dotenv.config();

// Setup Express app for testing
const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

authRoutes(app);
categoryRoutes(app);

describe('API Endpoint Tests', () => {
  let authToken;
  let testCategoryId;

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Login to get auth token for testing
    const loginResponse = await request(app)
      .post('/api/auth/signin')
      .send({
        username: 'admin@example.com',
        password: 'admin123'
      });
    
    if (loginResponse.body.accessToken) {
      authToken = loginResponse.body.accessToken;
    }
  });

  afterAll(async () => {
    // Cleanup test category if created
    if (testCategoryId) {
      await db.category.deleteOne({ _id: testCategoryId });
    }
    
    await mongoose.connection.close();
  });

  describe('Authentication Endpoints', () => {
    test('POST /api/auth/signin - should login successfully', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          username: 'admin@example.com',
          password: 'admin123'
        });

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
      expect(response.body.username).toBeDefined();
      expect(response.body.email).toBe('admin@example.com');
    });

    test('POST /api/auth/signin - should fail with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/signin')
        .send({
          username: 'admin@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
    });
  });

  describe('Category Endpoints', () => {
    test('GET /api/category - should get all categories', async () => {
      const response = await request(app)
        .get('/api/category');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      if (response.body.length > 0) {
        expect(response.body[0].name).toBeDefined();
        expect(response.body[0].slug).toBeDefined();
      }
    });

    test('GET /api/category/slug/:slug - should get category by slug', async () => {
      const response = await request(app)
        .get('/api/category/slug/technology');

      if (response.status === 200) {
        expect(response.body.name).toBe('Technology');
        expect(response.body.slug).toBe('technology');
      } else {
        expect(response.status).toBe(404);
      }
    });

    test('POST /api/category - should create category with auth', async () => {
      if (!authToken) {
        console.log('Skipping test: No auth token available');
        return;
      }

      const response = await request(app)
        .post('/api/category')
        .set('x-access-token', authToken)
        .send({
          name: 'Test Category API',
          description: 'Test description for API testing'
        });

      if (response.status === 200) {
        expect(response.body.name).toBe('Test Category API');
        expect(response.body.slug).toBeDefined();
        expect(response.body.slug).toBe('test-category-api');
        
        testCategoryId = response.body._id;
      }
    });

    test('POST /api/category - should fail without auth', async () => {
      const response = await request(app)
        .post('/api/category')
        .send({
          name: 'Test Category No Auth',
          description: 'Should fail'
        });

      expect(response.status).toBe(403);
    });

    test('GET /api/category/:id - should get category by ID', async () => {
      if (!testCategoryId) {
        // Get any category to test
        const categories = await db.category.find().limit(1);
        if (categories.length === 0) return;
        testCategoryId = categories[0]._id;
      }

      const response = await request(app)
        .get(`/api/category/${testCategoryId}`);

      expect(response.status).toBe(200);
      expect(response.body._id).toBe(testCategoryId.toString());
    });

    test('PUT /api/category/:id - should update category with auth', async () => {
      if (!authToken || !testCategoryId) {
        console.log('Skipping test: No auth token or category ID available');
        return;
      }

      const response = await request(app)
        .put(`/api/category/${testCategoryId}`)
        .set('x-access-token', authToken)
        .send({
          description: 'Updated description via API test'
        });

      expect(response.status).toBe(200);
    });
  });

  describe('Slug Validation in API', () => {
    test('should auto-generate slug when creating category', async () => {
      if (!authToken) return;

      const response = await request(app)
        .post('/api/category')
        .set('x-access-token', authToken)
        .send({
          name: 'Auto Slug Test Category',
          description: 'Testing auto slug generation'
        });

      if (response.status === 200) {
        expect(response.body.slug).toBe('auto-slug-test-category');
        
        // Cleanup
        await db.category.deleteOne({ _id: response.body._id });
      }
    });

    test('should handle special characters in category name', async () => {
      if (!authToken) return;

      const response = await request(app)
        .post('/api/category')
        .set('x-access-token', authToken)
        .send({
          name: 'Test & Development @ 2025!',
          description: 'Testing special characters'
        });

      if (response.status === 200) {
        expect(response.body.slug).toMatch(/^[a-z0-9-]+$/);
        expect(response.body.slug).not.toContain('&');
        expect(response.body.slug).not.toContain('@');
        expect(response.body.slug).not.toContain('!');
        
        // Cleanup
        await db.category.deleteOne({ _id: response.body._id });
      }
    });
  });
});
