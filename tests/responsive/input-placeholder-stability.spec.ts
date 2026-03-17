import {
  expect,
  test,
  type Locator,
  type Page,
  type Request,
} from '@playwright/test';
import { createStressFixture } from './stressDataset';

const successResponse = {
  data: {},
  resultCode: 0,
  messages: [],
  fieldsErrors: [],
};

type Box = {
  x: number;
  y: number;
  width: number;
  height: number;
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

const getBox = async (locator: Locator): Promise<Box> => {
  const box = await locator.boundingBox();
  if (!box) {
    throw new Error('Cannot read element bounding box');
  }

  return box;
};

const expectBoxStable = (baseline: Box, next: Box, epsilon = 0.5) => {
  expect(Math.abs(baseline.x - next.x)).toBeLessThanOrEqual(epsilon);
  expect(Math.abs(baseline.y - next.y)).toBeLessThanOrEqual(epsilon);
  expect(Math.abs(baseline.width - next.width)).toBeLessThanOrEqual(epsilon);
  expect(Math.abs(baseline.height - next.height)).toBeLessThanOrEqual(epsilon);
};

test.describe('create item input placeholder stability', () => {
  test('keeps floating label visible and preserves geometry on hover/focus', async ({
    page,
    baseURL,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem('token', 'regression-token');
    });

    await setupApiMocks(page);
    await page.goto(`${baseURL}/?stress=1`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(250);

    const input = page.getByLabel('Enter a title').first();
    const inputContainer = page.locator('.MuiFormControl-root').first();
    const inputRoot = page.locator('.MuiOutlinedInput-root').first();
    const label = page
      .locator('.MuiInputLabel-root', { hasText: 'Enter a title' })
      .first();
    const addButton = page.getByRole('button', { name: /^Add$/ }).first();

    await expect(input).toHaveValue('');
    await expect(input).not.toHaveAttribute('placeholder', 'Enter a title');
    await expect(label).toBeVisible();
    await expect
      .poll(() =>
        label.evaluate(element => {
          const styles = getComputedStyle(element);
          return (
            styles.opacity !== '0' &&
            styles.visibility !== 'hidden' &&
            styles.color !== 'rgba(0, 0, 0, 0)'
          );
        }),
      )
      .toBeTruthy();

    const baseInputBox = await getBox(input);
    const baseInputRootBox = await getBox(inputRoot);
    const baseButtonBox = await getBox(addButton);

    await input.hover();
    await expect(label).toBeVisible();
    expectBoxStable(baseInputBox, await getBox(input));
    expectBoxStable(baseInputRootBox, await getBox(inputRoot));
    expectBoxStable(baseButtonBox, await getBox(addButton));

    await input.click();
    await expect(label).toBeVisible();
    await expect(inputContainer).toHaveScreenshot(
      'create-item-input-focus.png',
      {
        animations: 'disabled',
        caret: 'hide',
        maxDiffPixelRatio: 0.01,
      },
    );
    expectBoxStable(baseInputBox, await getBox(input));
    expectBoxStable(baseInputRootBox, await getBox(inputRoot));
    expectBoxStable(baseButtonBox, await getBox(addButton));

    await input.fill('Layout stays stable');
    await expect(label).toBeVisible();
    expectBoxStable(baseInputBox, await getBox(input));
    expectBoxStable(baseInputRootBox, await getBox(inputRoot));
    expectBoxStable(baseButtonBox, await getBox(addButton));

    await input.clear();
    await expect(label).toBeVisible();
    await page.keyboard.press('Tab');
    await expect(label).toBeVisible();
    expectBoxStable(baseInputBox, await getBox(input));
    expectBoxStable(baseInputRootBox, await getBox(inputRoot));
    expectBoxStable(baseButtonBox, await getBox(addButton));
  });
});
