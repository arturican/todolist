import { spawn } from 'node:child_process';
import { createServer } from 'node:http';
import { access, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import lighthouse from 'lighthouse';
import { launch } from 'chrome-launcher';
import desktopConfig from 'lighthouse/core/config/desktop-config.js';

const PREVIEW_PORT = Number(process.env.LIGHTHOUSE_PREVIEW_PORT ?? 4173);
const API_PORT = Number(process.env.LIGHTHOUSE_API_PORT ?? 3001);
const artifactsDir = path.resolve('artifacts/lighthouse');

const routes = [
  { name: 'main', path: '/' },
  { name: 'login', path: '/login' },
];

const throttlingPresets = [
  { name: 'mobile', config: undefined },
  { name: 'desktop', config: desktopConfig },
];

const successResponse = JSON.stringify({
  data: {},
  resultCode: 0,
  messages: [],
  fieldsErrors: [],
});

const resolveChromePath = async () => {
  if (process.env.LIGHTHOUSE_CHROME_PATH) {
    return process.env.LIGHTHOUSE_CHROME_PATH;
  }

  const browsersRoot = path.resolve(
    process.env.PLAYWRIGHT_BROWSERS_PATH ?? '.playwright',
  );
  const entries = await readdir(browsersRoot, { withFileTypes: true }).catch(
    () => [],
  );

  const preferredDirs = entries
    .filter(
      entry =>
        entry.isDirectory() &&
        (entry.name.startsWith('chromium_headless_shell-') ||
          entry.name.startsWith('chromium-')),
    )
    .sort((a, b) => a.name.localeCompare(b.name))
    .reverse();

  for (const entry of preferredDirs) {
    const candidates = [
      path.join(
        browsersRoot,
        entry.name,
        'chrome-headless-shell-linux64',
        'chrome-headless-shell',
      ),
      path.join(browsersRoot, entry.name, 'chrome-linux64', 'chrome'),
      path.join(browsersRoot, entry.name, 'chrome-linux', 'chrome'),
    ];

    for (const candidate of candidates) {
      try {
        await access(candidate);
        return candidate;
      } catch (_) {
        // no-op
      }
    }
  }

  return undefined;
};

const writeJson = (res, statusCode, payload) => {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(payload));
};

const createMockApiServer = () =>
  createServer((req, res) => {
    const requestUrl = new URL(req.url ?? '/', `http://127.0.0.1:${API_PORT}`);
    const pathname = requestUrl.pathname;
    const method = req.method ?? 'GET';

    if (pathname === '/api/auth/me' && method === 'GET') {
      writeJson(res, 200, {
        data: {},
        resultCode: 1,
        messages: [],
        fieldsErrors: [],
      });
      return;
    }

    if (pathname === '/api/todo-lists' && method === 'GET') {
      writeJson(res, 200, [
        {
          id: 'tl-lh-1',
          title: 'Lighthouse todo list sample',
          addedDate: '2025-03-11T10:00:00',
          order: 0,
        },
      ]);
      return;
    }

    if (pathname === '/api/todo-lists/tl-lh-1/tasks' && method === 'GET') {
      writeJson(res, 200, {
        error: null,
        totalCount: 1,
        items: [
          {
            id: 'task-lh-1',
            todoListId: 'tl-lh-1',
            title: 'Check responsive behavior with Lighthouse',
            description: null,
            status: 0,
            priority: 1,
            startDate: null,
            deadline: null,
            order: 0,
            addedDate: '2025-03-11T10:10:00',
          },
        ],
      });
      return;
    }

    if (pathname.startsWith('/api/')) {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.end(successResponse);
      return;
    }

    res.statusCode = 404;
    res.end();
  });

const waitForServer = async (url, attempts = 60) => {
  for (let i = 0; i < attempts; i += 1) {
    try {
      const response = await fetch(url);
      if (response.ok || response.status >= 400) {
        return;
      }
    } catch (_) {
      // no-op
    }
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  throw new Error(`Server did not start: ${url}`);
};

const stopProcess = async processHandle => {
  if (!processHandle || processHandle.killed) {
    return;
  }
  processHandle.kill('SIGTERM');
  await new Promise(resolve => setTimeout(resolve, 500));
  if (!processHandle.killed) {
    processHandle.kill('SIGKILL');
  }
};

const run = async () => {
  await rm(artifactsDir, { recursive: true, force: true });
  await mkdir(artifactsDir, { recursive: true });

  const apiServer = createMockApiServer();
  await new Promise((resolve, reject) => {
    apiServer.once('error', reject);
    apiServer.listen(API_PORT, '127.0.0.1', resolve);
  });

  const previewProcess = spawn(
    'pnpm',
    [
      'exec',
      'vite',
      'preview',
      '--host',
      '127.0.0.1',
      '--port',
      String(PREVIEW_PORT),
      '--strictPort',
    ],
    {
      shell: false,
      stdio: 'inherit',
      env: {
        ...process.env,
        VITE_OPEN_BROWSER: 'false',
      },
    },
  );

  try {
    await waitForServer(`http://127.0.0.1:${PREVIEW_PORT}/`);

    const chromePath = await resolveChromePath();
    const chrome = await launch({
      chromePath,
      chromeFlags: [
        '--headless=new',
        '--no-sandbox',
        '--disable-gpu',
        '--disable-dev-shm-usage',
      ],
    });

    try {
      for (const route of routes) {
        for (const preset of throttlingPresets) {
          const url = `http://127.0.0.1:${PREVIEW_PORT}${route.path}`;
          const runnerResult = await lighthouse(
            url,
            {
              logLevel: 'error',
              output: ['html', 'json'],
              onlyCategories: [
                'performance',
                'accessibility',
                'best-practices',
                'seo',
              ],
              port: chrome.port,
            },
            preset.config,
          );

          if (!runnerResult) {
            throw new Error(`Lighthouse returned no result for ${url}`);
          }

          const [htmlReport, jsonReport] = runnerResult.report;
          const basename = `${route.name}__${preset.name}`;
          await writeFile(
            path.join(artifactsDir, `${basename}.html`),
            htmlReport,
            'utf8',
          );
          await writeFile(
            path.join(artifactsDir, `${basename}.json`),
            jsonReport,
            'utf8',
          );
        }
      }
    } finally {
      await chrome.kill();
    }
  } finally {
    await stopProcess(previewProcess);
    await new Promise(resolve => apiServer.close(resolve));
  }
};

run().catch(error => {
  console.error(error);
  process.exit(1);
});
