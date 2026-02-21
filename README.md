# Todolist

Frontend is at repository root (`src`, Vite build -> `dist`).
Backend is in `backend/` (TypeScript Express + Prisma, runtime entry -> `dist/src/server.js`).

## Local Run

Frontend:

```bash
pnpm install
pnpm dev
```

Backend:

```bash
pnpm --dir backend install
cp backend/.env.example backend/.env
pnpm --dir backend prisma:generate
pnpm --dir backend prisma:migrate
pnpm --dir backend prisma:seed
pnpm backend:dev
```

## Deployment

### CI Trigger

- GitHub Actions workflow: `.github/workflows/deploy.yml`
- Trigger: `push` to branch `dev` only

### Required GitHub Secrets

- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`
- `VPS_PORT` (optional, defaults to `22`)
- `FRONTEND_PATH` (example: `/var/www/todolist`)
- `BACKEND_PATH` (example: `/opt/todolist-api`)
- `BACKEND_PORT` (example: `3001`)
- `VPS_SSH_KNOWN_HOSTS` (optional, recommended)

### VPS Folder Structure

Frontend:

- `/var/www/todolist/releases/<git_sha>/`
- `/var/www/todolist/current -> /var/www/todolist/releases/<git_sha>`

Backend:

- `/opt/todolist-api/releases/<git_sha>/`
- `/opt/todolist-api/current -> /opt/todolist-api/releases/<git_sha>`

Both deploy scripts keep the latest 3 releases.

### Backend Environment File (on VPS)

Keep backend env outside repo, for example:

- `/etc/todolist/todolist-backend.env`

Example contents:

```env
NODE_ENV=production
HOST=127.0.0.1
PORT=3001
FRONTEND_ORIGIN=https://your-domain.com
DATABASE_URL=file:/opt/todolist-api/shared/prod.db
JWT_SECRET=change_me
JWT_EXPIRES_IN=7d
```

### Systemd Setup

1. Copy and adjust service unit:

```bash
sudo cp deploy/systemd/todolist-backend.service /etc/systemd/system/todolist-backend.service
```

2. Ensure `WorkingDirectory`, `ExecStart`, `EnvironmentFile`, `User`, `Group` match your server.
3. Enable and start:

```bash
sudo systemctl daemon-reload
sudo systemctl enable --now todolist-backend
sudo systemctl status todolist-backend --no-pager
```

### Nginx Setup

1. Copy site config:

```bash
sudo cp deploy/nginx/site.conf /etc/nginx/sites-available/todolist.conf
sudo ln -s /etc/nginx/sites-available/todolist.conf /etc/nginx/sites-enabled/todolist.conf
```

2. Adjust:
- `root` path (default `/var/www/todolist/current`)
- `proxy_pass` target port (default `127.0.0.1:3001`)

3. Validate and reload:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

### What CI Deploy Does

1. Builds frontend on runner (`pnpm run build`).
2. Uploads `dist/` to frontend release folder and atomically repoints `current`.
3. Uploads `backend/` source to backend release folder.
4. On VPS backend release:
   - `npm ci` (fallback `npm install` if no `package-lock.json`)
   - `npm run prisma:generate`
   - `npm run prisma:deploy`
   - `npm run build`
   - `npm prune --omit=dev`
5. Atomically repoints backend `current`.
6. Restarts systemd service (`todolist-backend`).
7. Validates:
   - `curl -f http://127.0.0.1:<BACKEND_PORT>/api/health`
   - `sudo nginx -t`
   - `sudo systemctl reload nginx`

If you deploy frontend under a subpath (not `/`), set `VITE_PUBLIC_BASE` in the workflow build step and align Nginx locations.
Current workflow is configured with `VITE_PUBLIC_BASE=/todolist/`.

### Rollback

Frontend rollback:

```bash
ls -1dt /var/www/todolist/releases/*
sudo ln -sfn /var/www/todolist/releases/<previous_sha> /var/www/todolist/current
```

Backend rollback:

```bash
ls -1dt /opt/todolist-api/releases/*
sudo ln -sfn /opt/todolist-api/releases/<previous_sha> /opt/todolist-api/current
sudo systemctl restart todolist-backend
```

## Responsive QA

See `README_RESPONSIVE.md` for:

- supported viewport matrix;
- Playwright responsive smoke command;
- Storybook viewport workflow;
- Lighthouse report generation and artifact paths.

See `README_STRESS_RESPONSIVE.md` for:

- stress seed datasets;
- responsive stress screenshots on large data;
- CI artifact expectations for stress layout checks.

### Troubleshooting Checklist

1. Check GitHub Actions logs for missing secrets or SSH issues.
2. Verify release symlinks:
   - `readlink -f /var/www/todolist/current`
   - `readlink -f /opt/todolist-api/current`
3. Check backend service:
   - `sudo systemctl status todolist-backend --no-pager`
   - `journalctl -u todolist-backend -n 200 --no-pager`
4. Run health check:
   - `curl -f http://127.0.0.1:3001/api/health`
5. Validate Nginx:
   - `sudo nginx -t`
   - `sudo systemctl reload nginx`
