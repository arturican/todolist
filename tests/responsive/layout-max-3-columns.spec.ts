import { expect, test, type Page } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { createStressFixture } from './stressDataset';

const artifactRoot = path.resolve('artifacts/responsive/layout-check');

const viewports = [
  { width: 1920, height: 1080 },
  { width: 2560, height: 1440 },
  { width: 3840, height: 2160 },
];

const successResponse = {
  data: {},
  resultCode: 0,
  messages: [],
  fieldsErrors: [],
};

const setupApiMocks = async (page: Page) => {
  const fixture = createStressFixture('many-lists');
  const todolists = [...fixture.todolists];
  const tasksByTodolist = Object.fromEntries(
    Object.entries(fixture.tasksByTodolist).map(([id, tasks]) => [
      id,
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
          data: { id: 1, email: 'layout@test.dev', login: 'layout' },
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

    if (pathname.startsWith('/api/todo-lists/')) {
      await route.fulfill({ status: 200, json: successResponse });
      return;
    }

    await route.continue();
  });
};

const getRenderedColumnCount = async (page: Page) => {
  return page.evaluate(() => {
    const cards = Array.from(
      document.querySelectorAll<HTMLElement>('[data-testid="todolist-card"]'),
    );
    if (cards.length === 0) return 0;

    const rects = cards
      .map(card => card.getBoundingClientRect())
      .filter(rect => rect.width > 0 && rect.height > 0);
    if (rects.length === 0) return 0;

    const firstRowTop = Math.min(...rects.map(rect => rect.top));
    const firstRowRects = rects.filter(
      rect => Math.abs(rect.top - firstRowTop) < 3,
    );
    const uniqueColumns = new Set(
      firstRowRects.map(rect => Math.round(rect.left)),
    );

    return uniqueColumns.size;
  });
};

test.describe('layout: max 3 columns', () => {
  for (const viewport of viewports) {
    test(`never renders more than 3 columns at ${viewport.width}x${viewport.height}`, async ({
      browser,
      baseURL,
    }) => {
      const context = await browser.newContext({
        viewport: {
          width: viewport.width,
          height: viewport.height,
        },
      });
      const page = await context.newPage();

      await page.addInitScript(() => {
        localStorage.setItem('token', 'layout-token');
      });

      await setupApiMocks(page);
      await page.goto(`${baseURL}/?stress=1&dataset=many-lists`, {
        waitUntil: 'networkidle',
      });
      await page.waitForTimeout(250);

      await mkdir(artifactRoot, { recursive: true });
      await page.screenshot({
        path: path.join(
          artifactRoot,
          `columns__${viewport.width}x${viewport.height}.png`,
        ),
        fullPage: true,
      });

      const columnsCount = await getRenderedColumnCount(page);
      expect(columnsCount).toBeLessThanOrEqual(3);

      await context.close();
    });
  }
});
