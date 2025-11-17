const { test, expect, request: playwrightRequest } = require('@playwright/test');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../server/src/app');

let server;
let mongoServer;
let baseUrl;
let authHeader;
let apiContext;

test.beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  server = app.listen(0);
  const { port } = server.address();
  baseUrl = `http://127.0.0.1:${port}/api`;

  apiContext = await playwrightRequest.newContext();
  const credentials = {
    username: `e2e-${Date.now()}`,
    email: `e2e-${Date.now()}@example.com`,
    password: 'password123'
  };

  const registerResponse = await apiContext.post(`${baseUrl}/auth/register`, { data: credentials });
  expect(registerResponse.status()).toBe(201);
  const registerPayload = await registerResponse.json();
  expect(registerPayload).toHaveProperty('token');

  const loginResponse = await apiContext.post(`${baseUrl}/auth/login`, {
    data: {
      email: credentials.email,
      password: credentials.password
    }
  });
  expect(loginResponse.status()).toBe(200);
  const loginPayload = await loginResponse.json();
  authHeader = `Bearer ${loginPayload.token}`;
});

test.afterAll(async () => {
  if (apiContext) {
    await apiContext.dispose();
  }
  await mongoose.disconnect();
  await mongoServer.stop();
  await new Promise((resolve) => server.close(resolve));
});

test('posts lifecycle via public API', async ({ request }) => {
  const payload = {
    title: 'End-to-end post',
    content: 'Valid content for end to end testing path.',
    category: new mongoose.Types.ObjectId().toString(),
    status: 'published'
  };

  const createResponse = await request.post(`${baseUrl}/posts`, {
    data: payload,
    headers: { Authorization: authHeader }
  });
  expect(createResponse.status()).toBe(201);
  const createdPost = await createResponse.json();
  expect(createdPost.title).toBe(payload.title);

  const listResponse = await request.get(`${baseUrl}/posts`);
  expect(listResponse.status()).toBe(200);
  const posts = await listResponse.json();
  expect(posts.length).toBeGreaterThan(0);

  const updateResponse = await request.put(`${baseUrl}/posts/${createdPost._id}`, {
    data: { title: 'Updated via e2e' },
    headers: { Authorization: authHeader }
  });
  expect(updateResponse.status()).toBe(200);
  const updated = await updateResponse.json();
  expect(updated.title).toBe('Updated via e2e');

  const deleteResponse = await request.delete(`${baseUrl}/posts/${createdPost._id}`, {
    headers: { Authorization: authHeader }
  });
  expect(deleteResponse.status()).toBe(200);
});

