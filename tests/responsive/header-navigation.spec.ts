import { expect, test, type Page } from '@playwright/test';

type ViewportPreset = {
  width: number;
  height: number;
};

const viewports: ViewportPreset[] = [
  { width: 320, height: 568 },
  { width: 375, height: 812 },
  { width: 390, height: 844 },
  { width: 480, height: 932 },
  { width: 768, height: 1024 },
  { width: 1024, height: 768 },
  { width: 1280, height: 720 },
  { width: 1440, height: 900 },
];

const todolists = [
  {
    id: 'tl-1',
    title: 'Personal errands and priorities for the current week',
    addedDate: '2025-03-01T09:00:00',
    order: 0,
  },
];

const tasksByTodolist: Record<string, unknown[]> = {
  'tl-1': [
    {
      id: 'task-1',
      todoListId: 'tl-1',
      title: 'Buy groceries for the week',
      description: null,
      status: 0,
      priority: 1,
      startDate: null,
      deadline: null,
      order: 0,
      addedDate: '2025-03-01T09:30:00',
    },
  ],
};

const successResponse = {
  data: {},
  resultCode: 0,
  messages: [],
  fieldsErrors: [],
};

const setupApiMocks = async (page: Page) => {
  await page.route('**/api/**', async route => {
    const request = route.request();
    const method = request.method();
    const pathname = new URL(request.url()).pathname;

    if (pathname === '/api/auth/me' && method === 'GET') {
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

test.describe('header-navigation', () => {
  for (const viewport of viewports) {
    test(`header behaves correctly at ${viewport.width}px`, async ({
      browser,
      baseURL,
    }) => {
      const context = await browser.newContext({
        viewport: { width: viewport.width, height: viewport.height },
      });
      const page = await context.newPage();

      await page.addInitScript(() => {
        localStorage.setItem('token', 'responsive-smoke-token');
      });

      await setupApiMocks(page);
      await page.goto(`${baseURL}/`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(200);

      const burgerButton = page.getByTestId('mobile-header-menu-button');
      const desktopNavigation = page.getByTestId('desktop-header-navigation');
      const mobileMenu = page.getByTestId('mobile-header-menu');

      await assertNoHorizontalOverflow(page);

      if (viewport.width < 768) {
        await expect(burgerButton).toBeVisible();
        await expect(desktopNavigation).not.toBeVisible();
        await expect(mobileMenu).toBeHidden();

        await burgerButton.click();
        await expect(mobileMenu).toBeVisible();

        const bodyOverflow = await page.evaluate(
          () => document.body.style.overflow,
        );
        expect(bodyOverflow).toBe('hidden');

        await page.keyboard.press('Escape');
        await expect(mobileMenu).toBeHidden();

        await burgerButton.click();
        await expect(mobileMenu).toBeVisible();
        await page.locator('main').click({ position: { x: 10, y: 10 } });
        await expect(mobileMenu).toBeHidden();
      } else {
        await expect(burgerButton).not.toBeVisible();
        await expect(desktopNavigation).toBeVisible();
        await expect(desktopNavigation.locator('a,button')).toHaveCount(3);
      }

      await context.close();
    });
  }
});
