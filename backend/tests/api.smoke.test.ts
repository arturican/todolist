import bcrypt from 'bcryptjs';
import request from 'supertest';
import { prisma } from '../src/db/prisma.js';
import { app } from '../src/app.js';

const DEMO_EMAIL = 'admin';
const DEMO_PASSWORD = 'admin';

const loginAndGetToken = async () => {
  const loginResponse = await request(app)
    .post('/api/auth/login')
    .send({ email: DEMO_EMAIL, password: DEMO_PASSWORD, rememberMe: false });

  expect(loginResponse.status).toBe(200);
  expect(loginResponse.body.resultCode).toBe(0);
  return loginResponse.body.data.token as string;
};

beforeAll(async () => {
  const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 10);

  await prisma.task.deleteMany();
  await prisma.todolist.deleteMany();
  await prisma.user.deleteMany();

  await prisma.user.create({
    data: {
      email: DEMO_EMAIL,
      login: 'admin',
      passwordHash,
    },
  });
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
