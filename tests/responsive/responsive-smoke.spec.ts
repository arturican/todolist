import { expect, test, type Page } from '@playwright/test';
import { mkdir, rm } from 'node:fs/promises';
import * as path from 'node:path';

type ScreenGroup = 'mobile' | 'tablet' | 'desktop' | '2k' | '4k';

type ViewportPreset = {
  name: string;
  width: number;
  height: number;
  group: ScreenGroup;
};

type RoutePreset = {
  name: string;
  path: string;
  authenticated: boolean;
};

const includeUltraWide5k = process.env.INCLUDE_5K2K === 'true';
const artifactRoot = path.resolve('artifacts/responsive');

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

const routes: RoutePreset[] = [
  { name: 'login', path: '/login', authenticated: false },
  { name: 'main', path: '/', authenticated: true },
  { name: 'faq', path: '/faq', authenticated: true },
  { name: 'not-found', path: '/missing-page', authenticated: true },
];

const todolists = [
  {
    id: 'tl-1',
    title: 'Personal errands and priorities for the current week',
    addedDate: '2025-03-01T09:00:00',
    order: 0,
  },
  {
    id: 'tl-2',
    title: 'Work backlog with several long task names for wrapping checks',
    addedDate: '2025-03-02T10:00:00',
    order: 1,
  },
  {
    id: 'tl-3',
    title: 'Home and family plans',
    addedDate: '2025-03-03T11:00:00',
    order: 2,
  },
];

const tasksByTodolist: Record<string, unknown[]> = {
  'tl-1': [
    {
      id: 'task-1',
      todoListId: 'tl-1',
      title:
        'Buy groceries, including vegetables, fruits, and ingredients for dinner',
      description: null,
      status: 0,
      priority: 1,
      startDate: null,
      deadline: null,
      order: 0,
      addedDate: '2025-03-01T09:30:00',
    },
    {
      id: 'task-2',
      todoListId: 'tl-1',
      title: 'Schedule annual medical checkup',
      description: null,
      status: 2,
      priority: 2,
      startDate: null,
      deadline: null,
      order: 1,
      addedDate: '2025-03-01T12:00:00',
    },
  ],
  'tl-2': [
    {
      id: 'task-3',
      todoListId: 'tl-2',
      title:
        'Prepare release notes and verify responsive behavior on all target breakpoints',
      description: null,
      status: 1,
      priority: 3,
      startDate: null,
      deadline: null,
      order: 0,
      addedDate: '2025-03-02T10:30:00',
    },
  ],
  'tl-3': [],
};

const successResponse = {
  data: {},
  resultCode: 0,
  messages: [],
  fieldsErrors: [],
};

const setupApiMocks = async (page: Page, authenticated: boolean) => {
  await page.route('**/api/**', async route => {
    const request = route.request();
    const method = request.method();
    const pathname = new URL(request.url()).pathname;

    if (pathname === '/api/auth/me' && method === 'GET') {
      if (authenticated) {
        await route.fulfill({
          status: 200,
          json: {
            data: { id: 1, email: 'responsive@test.dev', login: 'responsive' },
            resultCode: 0,
            messages: [],
            fieldsErrors: [],
          },
        });
        return;
      }

      await route.fulfill({
        status: 200,
        json: {
          data: {},
          resultCode: 1,
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
          data: { userId: 1, token: 'responsive-smoke-token' },
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

    const tasksMatch = pathname.match(/^\/api\/todo-lists\/([^/]+)\/tasks$/);
    if (tasksMatch && method === 'GET') {
      const todolistId = tasksMatch[1];
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

const assertNoHorizontalOverflow = async (page: Page) => {
  const hasOverflow = await page.evaluate(() => {
    const root = document.documentElement;
    return root.scrollWidth > root.clientWidth + 1;
  });
  expect(hasOverflow).toBeFalsy();
};

test.describe('responsive-smoke', () => {
  test.beforeAll(async () => {
    await rm(artifactRoot, { recursive: true, force: true });
  });

  for (const viewport of viewports) {
    for (const routePreset of routes) {
      test(`${routePreset.name} @ ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
        browser,
        baseURL,
      }) => {
        const context = await browser.newContext({
          viewport: { width: viewport.width, height: viewport.height },
        });
        const page = await context.newPage();

        await page.addInitScript(isAuthed => {
          localStorage.removeItem('token');
          if (isAuthed) {
            localStorage.setItem('token', 'responsive-smoke-token');
          }
        }, routePreset.authenticated);

        await setupApiMocks(page, routePreset.authenticated);
        await page.goto(`${baseURL}${routePreset.path}`, {
          waitUntil: 'networkidle',
        });
        await page.waitForTimeout(200);

        await assertNoHorizontalOverflow(page);

        const outputDir = path.join(artifactRoot, viewport.group);
        await mkdir(outputDir, { recursive: true });
        await page.screenshot({
          path: path.join(
            outputDir,
            `${routePreset.name}__${viewport.width}x${viewport.height}.png`,
          ),
          fullPage: true,
        });

        await context.close();
      });
    }
  }
});
