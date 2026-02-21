import { expect, test, type Page, type Request } from '@playwright/test';
import { mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import {
  createStressFixture,
  type StressDatasetId,
  type StressFixture,
} from './stressDataset';

type ScreenGroup = 'mobile' | 'tablet' | 'desktop' | '2k' | '4k';

type ViewportPreset = {
  name: string;
  width: number;
  height: number;
  group: ScreenGroup;
};

const includeUltraWide5k = process.env.INCLUDE_5K2K === 'true';
const artifactRoot = path.resolve('artifacts/responsive/stress');

const viewports: ViewportPreset[] = [
  { name: 'iphone-se', width: 320, height: 568, group: 'mobile' },
  { name: 'iphone-x', width: 375, height: 812, group: 'mobile' },
  { name: 'iphone-12-14', width: 390, height: 844, group: 'mobile' },
  { name: 'iphone-plus-max', width: 414, height: 896, group: 'mobile' },
  { name: 'ipad-portrait', width: 768, height: 1024, group: 'tablet' },
  { name: 'ipad-landscape', width: 1024, height: 768, group: 'tablet' },
  { name: 'laptop-small', width: 1280, height: 720, group: 'desktop' },
  { name: 'laptop', width: 1440, height: 900, group: 'desktop' },
  { name: 'full-hd', width: 1920, height: 1080, group: 'desktop' },
  { name: 'qhd', width: 2560, height: 1440, group: '2k' },
  { name: 'uwqhd', width: 3440, height: 1440, group: '2k' },
  { name: 'uhd-4k', width: 3840, height: 2160, group: '4k' },
];

if (includeUltraWide5k) {
  viewports.push({
    name: 'uw-5k2k',
    width: 5120,
    height: 2160,
    group: '4k',
  });
}

const datasetIds: StressDatasetId[] = [
  'single-list',
  'ten-lists',
  'many-lists',
];

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

const setupApiMocks = async (page: Page, fixture: StressFixture) => {
  const todolists = [...fixture.todolists];
  const tasksByTodolist = Object.fromEntries(
    Object.entries(fixture.tasksByTodolist).map(([todolistId, tasks]) => [
      todolistId,
      [...tasks],
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
          data: { id: 1, email: 'stress@test.dev', login: 'stress' },
          resultCode: 0,
          messages: [],
          fieldsErrors: [],
        },
      });
      return;
    }

    if (pathname === '/api/auth/login' && method === 'POST') {
      await route.fulfill({
        status: 200,
        json: {
          data: { userId: 1, token: 'stress-token' },
          resultCode: 0,
          messages: [],
          fieldsErrors: [],
        },
      });
      return;
    }

    if (pathname === '/api/auth/login' && method === 'DELETE') {
      await route.fulfill({ status: 200, json: successResponse });
      return;
    }

    if (pathname === '/api/todo-lists' && method === 'GET') {
      await route.fulfill({ status: 200, json: todolists });
      return;
    }

    if (pathname === '/api/todo-lists' && method === 'POST') {
      const body = parseBody<{ title: string }>(request);
      const created = {
        id: `created-list-${Date.now()}`,
        title: body.title ?? 'Untitled',
        addedDate: '2026-02-01T09:00:00',
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

    const listMatch = pathname.match(/^\/api\/todo-lists\/([^/]+)$/);
    if (listMatch && method === 'DELETE') {
      const todolistId = listMatch[1];
      const index = todolists.findIndex(todolist => todolist.id === todolistId);
      if (index !== -1) {
        todolists.splice(index, 1);
      }
      delete tasksByTodolist[todolistId];
      await route.fulfill({ status: 200, json: successResponse });
      return;
    }

    if (listMatch && method === 'PUT') {
      const todolistId = listMatch[1];
      const body = parseBody<{ title: string }>(request);
      const todolist = todolists.find(item => item.id === todolistId);
      if (todolist && body.title) {
        todolist.title = body.title;
      }
      await route.fulfill({ status: 200, json: successResponse });
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
        title: body.title ?? 'New task',
        description: null,
        status: 0,
        priority: 0,
        startDate: null,
        deadline: null,
        order: items.length,
        addedDate: '2026-02-01T10:00:00',
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

    const taskMatch = pathname.match(
      /^\/api\/todo-lists\/([^/]+)\/tasks\/([^/]+)$/,
    );
    if (taskMatch && method === 'DELETE') {
      const todolistId = taskMatch[1];
      const taskId = taskMatch[2];
      const items = tasksByTodolist[todolistId] ?? [];
      tasksByTodolist[todolistId] = items.filter(task => task.id !== taskId);
      await route.fulfill({ status: 200, json: successResponse });
      return;
    }

    if (taskMatch && method === 'PUT') {
      const todolistId = taskMatch[1];
      const taskId = taskMatch[2];
      const body = parseBody<Record<string, unknown>>(request);
      const items = tasksByTodolist[todolistId] ?? [];
      const task = items.find(item => item.id === taskId);
      if (task) {
        Object.assign(task, body);
      }
      await route.fulfill({
        status: 200,
        json: {
          ...successResponse,
          data: {
            item:
              task ??
              ({
                id: taskId,
                todoListId: todolistId,
              } as Record<string, unknown>),
          },
        },
      });
      return;
    }

    await route.continue();
  });
};

const assertNoHorizontalOverflow = async (page: Page) => {
  const hasOverflow = await page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth > root.clientWidth + 1;
  });
  expect(hasOverflow).toBeFalsy();
};

test.describe('responsive-stress', () => {
  test.beforeAll(async () => {
    await rm(artifactRoot, { recursive: true, force: true });
  });

  for (const datasetId of datasetIds) {
    for (const viewport of viewports) {
      test(`${datasetId} @ ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
        browser,
        baseURL,
      }) => {
        const fixture = createStressFixture(datasetId);
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
        });
        const page = await context.newPage();

        await page.addInitScript(() => {
          localStorage.setItem('token', 'stress-token');
        });

        await setupApiMocks(page, fixture);
        await page.goto(`${baseURL}/?stress=1&dataset=${datasetId}`, {
          waitUntil: 'networkidle',
        });
        await page.waitForTimeout(250);
        await assertNoHorizontalOverflow(page);

        const outputDir = path.join(artifactRoot, viewport.group);
        await mkdir(outputDir, { recursive: true });

        await page.screenshot({
          path: path.join(
            outputDir,
            `lists__${datasetId}__${viewport.width}x${viewport.height}.png`,
          ),
          fullPage: true,
        });

        const heavyCard = page
          .locator(
            `[data-testid="todolist-card"][data-todolist-id="${fixture.heavyTodolistId}"]`,
          )
          .first();
        await expect(heavyCard).toBeVisible();
        await heavyCard.screenshot({
          path: path.join(
            outputDir,
            `heavy-todolist__${datasetId}__${viewport.width}x${viewport.height}.png`,
          ),
        });

        const heavyPanel = page
          .locator(
            `[data-testid="task-list-panel"][data-todolist-id="${fixture.heavyTodolistId}"]`,
          )
          .first();
        await expect(heavyPanel).toBeVisible();
        await heavyPanel.evaluate(element => {
          element.scrollTop = element.scrollHeight;
        });
        await page.waitForTimeout(150);
        await heavyCard.screenshot({
          path: path.join(
            outputDir,
            `heavy-todolist-scrolled__${datasetId}__${viewport.width}x${viewport.height}.png`,
          ),
        });

        await context.close();
      });
    }
  }
});
