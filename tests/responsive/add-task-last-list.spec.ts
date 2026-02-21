import { expect, test, type Page, type Request } from '@playwright/test';
import { createStressFixture } from './stressDataset';

const successResponse = {
  data: {},
  resultCode: 0,
  messages: [],
  fieldsErrors: [],
};

const parseBody = <T>(request: Request): T => {
  const raw = request.postData();
  if (!raw) return {} as T;
  return JSON.parse(raw) as T;
};

const setupApiMocks = async (page: Page) => {
  const fixture = createStressFixture('ten-lists');
  const todolists = [...fixture.todolists.slice(0, 4)];
  const tasksByTodolist = Object.fromEntries(
    todolists.map(todolist => [
      todolist.id,
      [...fixture.tasksByTodolist[todolist.id]],
    ]),
  );

  await page.route('**/api/**', async route => {
    const request = route.request();
    const method = request.method();
    const pathname = new URL(request.url()).pathname;

    if (pathname === '/api/auth/me' && method === 'GET') {
      await route.fulfill({
        status: 200,
        json: {
          data: { id: 1, email: 'regression@test.dev', login: 'regression' },
          resultCode: 0,
          messages: [],
          fieldsErrors: [],
        },
      });
      return;
    }

    if (pathname === '/api/todo-lists' && method === 'GET') {
      await route.fulfill({ status: 200, json: todolists });
      return;
    }

    if (pathname === '/api/todo-lists' && method === 'POST') {
      const body = parseBody<{ title: string }>(request);
      const created = {
        id: `created-list-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
        title: body.title ?? 'Untitled list',
        addedDate: '2026-02-05T10:00:00',
        order: todolists.length,
      };
      todolists.unshift(created);
      tasksByTodolist[created.id] = [];
      await route.fulfill({
        status: 200,
        json: {
          ...successResponse,
          data: { item: created },
        },
      });
      return;
    }

    const taskListMatch = pathname.match(/^\/api\/todo-lists\/([^/]+)\/tasks$/);
    if (taskListMatch && method === 'GET') {
      const todolistId = taskListMatch[1];
      const items = tasksByTodolist[todolistId] ?? [];
      await route.fulfill({
        status: 200,
        json: {
          error: null,
          totalCount: items.length,
          items,
        },
      });
      return;
    }

    if (taskListMatch && method === 'POST') {
      const todolistId = taskListMatch[1];
      const body = parseBody<{ title: string }>(request);
      const items = tasksByTodolist[todolistId] ?? [];
      const createdTask = {
        id: `${todolistId}-created-${items.length + 1}`,
        todoListId: todolistId,
        title: body.title ?? 'Untitled task',
        description: null,
        status: 0,
        priority: 0,
        startDate: null,
        deadline: null,
        order: items.length,
        addedDate: '2026-02-05T12:00:00',
      };
      items.unshift(createdTask);
      tasksByTodolist[todolistId] = items;

      await route.fulfill({
        status: 200,
        json: {
          ...successResponse,
          data: { item: createdTask },
        },
      });
      return;
    }

    if (pathname.startsWith('/api/todo-lists/')) {
      await route.fulfill({ status: 200, json: successResponse });
      return;
    }

    await route.continue();
  });
};

test.describe('add task to last todolist', () => {
  test('creates several lists and adds task into the last one only', async ({
    page,
    baseURL,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'regression-token');
    });

    await setupApiMocks(page);
    await page.goto(`${baseURL}/?stress=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);

    const rootInput = page.getByLabel('Enter a title').first();
    const rootAddButton = page.getByRole('button', { name: /^Add$/ }).first();

    await rootInput.fill('Extra list A');
    await rootAddButton.click();
    await rootInput.fill('Extra list B');
    await rootAddButton.click();
    await page.waitForTimeout(200);

    const cards = page.locator('[data-testid="todolist-card"]');
    const cardCount = await cards.count();
    expect(cardCount).toBeGreaterThanOrEqual(3);

    const lastCard = cards.nth(cardCount - 1);
    const uniqueTaskTitle = `E2E last list task ${Date.now()}`;

    await lastCard.getByLabel('Enter a title').fill(uniqueTaskTitle);
    await lastCard.getByRole('button', { name: /^Add$/ }).click();

    await expect(lastCard).toContainText(uniqueTaskTitle);

    for (let index = 0; index < cardCount - 1; index += 1) {
      await expect(cards.nth(index)).not.toContainText(uniqueTaskTitle);
    }
  });
});
