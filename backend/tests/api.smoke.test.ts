import bcrypt from 'bcryptjs';
import request from 'supertest';
import { prisma } from '../src/db/prisma.js';
import { app } from '../src/app.js';

const DEMO_EMAIL = 'admin';
const DEMO_PASSWORD = 'admin';
const OTHER_EMAIL = 'teammate';
const OTHER_PASSWORD = 'teammate';

let otherUserId = 0;

const loginAndGetToken = async () => {
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({ email: DEMO_EMAIL, password: DEMO_PASSWORD, rememberMe: false });

  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body.resultCode).toBe(0);
  return loginResponse.body.data.token as string;
};

beforeAll(async () => {
  const [demoPasswordHash, otherPasswordHash] = await Promise.all([
    bcrypt.hash(DEMO_PASSWORD, 10),
    bcrypt.hash(OTHER_PASSWORD, 10),
  ]);

  await prisma.task.deleteMany();
  await prisma.todolist.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      email: DEMO_EMAIL,
      login: 'admin',
      passwordHash: demoPasswordHash,
    },
  });

  const otherUser = await prisma.user.create({
    data: {
      email: OTHER_EMAIL,
      login: 'teammate',
      passwordHash: otherPasswordHash,
    },
  });

  otherUserId = otherUser.id;
});

afterAll(async () => {
  await prisma.$disconnect();
});

test('health endpoint works', async () => {
  const response = await request(app).get('/api/health');
  expect(response.status).toBe(200);
  expect(response.body.status).toBe('ok');
});

test('auth login + me flow works', async () => {
  const token = await loginAndGetToken();

  const meResponse = await request(app)
    .get('/api/auth/me')
    .set('Authorization', `Bearer ${token}`);

  expect(meResponse.status).toBe(200);
  expect(meResponse.body.resultCode).toBe(0);
  expect(meResponse.body.data.email).toBe(DEMO_EMAIL);
});

test('logout revokes the current token', async () => {
  const token = await loginAndGetToken();

  const logoutResponse = await request(app)
    .delete('/api/auth/login')
    .set('Authorization', `Bearer ${token}`);

  expect(logoutResponse.status).toBe(200);
  expect(logoutResponse.body.resultCode).toBe(0);

  const meResponse = await request(app)
    .get('/api/auth/me')
    .set('Authorization', `Bearer ${token}`);

  expect(meResponse.status).toBe(200);
  expect(meResponse.body.resultCode).toBe(1);
  expect(meResponse.body.messages).toContain('You are not authorized');
});

test('todolist create + list flow works', async () => {
  const token = await loginAndGetToken();

  const createResponse = await request(app)
    .post('/api/todo-lists')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Smoke list' });

  expect(createResponse.status).toBe(200);
  expect(createResponse.body.resultCode).toBe(0);
  expect(createResponse.body.data.item.title).toBe('Smoke list');

  const listResponse = await request(app)
    .get('/api/todo-lists')
    .set('Authorization', `Bearer ${token}`);

  expect(listResponse.status).toBe(200);
  expect(Array.isArray(listResponse.body)).toBe(true);
  expect(listResponse.body.length).toBeGreaterThan(0);
});

test('task create + update + list + delete flow works', async () => {
  const token = await loginAndGetToken();

  const createListResponse = await request(app)
    .post('/api/todo-lists')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Task list' });

  const todolistId = createListResponse.body.data.item.id as string;

  const createTaskResponse = await request(app)
    .post(`/api/todo-lists/${todolistId}/tasks`)
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Initial task' });

  expect(createTaskResponse.status).toBe(200);
  expect(createTaskResponse.body.resultCode).toBe(0);

  const taskId = createTaskResponse.body.data.item.id as string;

  const updateTaskResponse = await request(app)
    .put(`/api/todo-lists/${todolistId}/tasks/${taskId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      description: 'updated description',
      title: 'Updated task',
      status: 2,
      priority: 1,
      startDate: null,
      deadline: null,
    });

  expect(updateTaskResponse.status).toBe(200);
  expect(updateTaskResponse.body.resultCode).toBe(0);
  expect(updateTaskResponse.body.data.item.title).toBe('Updated task');

  const listTasksResponse = await request(app)
    .get(`/api/todo-lists/${todolistId}/tasks`)
    .set('Authorization', `Bearer ${token}`);

  expect(listTasksResponse.status).toBe(200);
  expect(listTasksResponse.body.error).toBeNull();
  expect(listTasksResponse.body.totalCount).toBe(1);

  const deleteTaskResponse = await request(app)
    .delete(`/api/todo-lists/${todolistId}/tasks/${taskId}`)
    .set('Authorization', `Bearer ${token}`);

  expect(deleteTaskResponse.status).toBe(200);
  expect(deleteTaskResponse.body.resultCode).toBe(0);
});

test('invalid task update payload is rejected', async () => {
  const token = await loginAndGetToken();

  const createListResponse = await request(app)
    .post('/api/todo-lists')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Validation list' });

  const todolistId = createListResponse.body.data.item.id as string;

  const createTaskResponse = await request(app)
    .post(`/api/todo-lists/${todolistId}/tasks`)
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Needs valid update' });

  const taskId = createTaskResponse.body.data.item.id as string;

  const updateTaskResponse = await request(app)
    .put(`/api/todo-lists/${todolistId}/tasks/${taskId}`)
    .set('Authorization', `Bearer ${token}`)
    .send({
      description: 'still here',
      title: 'Updated task',
      status: 99,
      priority: 1,
      startDate: null,
      deadline: null,
    });

  expect(updateTaskResponse.status).toBe(200);
  expect(updateTaskResponse.body.resultCode).toBe(1);
  expect(updateTaskResponse.body.fieldsErrors).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        field: 'status',
      }),
    ]),
  );
});

test('user cannot access another users todolist', async () => {
  const token = await loginAndGetToken();

  const foreignList = await prisma.todolist.create({
    data: {
      title: 'Private board',
      order: 99,
      userId: otherUserId,
    },
  });

  const response = await request(app)
    .get(`/api/todo-lists/${foreignList.id}/tasks`)
    .set('Authorization', `Bearer ${token}`);

  expect(response.status).toBe(200);
  expect(response.body.error).toBe('Todolist not found');
  expect(response.body.items).toEqual([]);
});

test('invalid json payload returns a 400 response', async () => {
  const response = await request(app)
    .post('/api/auth/login')
    .set('Content-Type', 'application/json')
    .send('{"email":"admin"');

  expect(response.status).toBe(400);
  expect(response.body.resultCode).toBe(1);
  expect(response.body.messages).toContain('Invalid JSON payload');
});

test('request id header is echoed back', async () => {
  const response = await request(app)
    .get('/api/health')
    .set('X-Request-Id', 'test-request-id');

  expect(response.status).toBe(200);
  expect(response.headers['x-request-id']).toBe('test-request-id');
});

test('login is rate limited after repeated failures', async () => {
  const forwardedFor = '203.0.113.10';

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const response = await request(app)
      .post('/api/auth/login')
      .set('X-Forwarded-For', forwardedFor)
      .send({
        email: DEMO_EMAIL,
        password: 'wrong-password',
        rememberMe: false,
      });

    expect(response.status).toBe(200);
    expect(response.body.resultCode).toBe(1);
  }

  const limitedResponse = await request(app)
    .post('/api/auth/login')
    .set('X-Forwarded-For', forwardedFor)
    .send({
      email: DEMO_EMAIL,
      password: 'wrong-password',
      rememberMe: false,
    });

  expect(limitedResponse.status).toBe(429);
  expect(limitedResponse.body.resultCode).toBe(1);
  expect(limitedResponse.body.messages).toContain(
    'Too many login attempts. Please try again later.',
  );
});
