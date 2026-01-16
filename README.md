Веб-приложение для управления задачами, разработанное на React
с использованием функциональных компонентов и хуков.
Подходит для изучения архитектуры фронтенд-приложений и работы с состоянием.

## CI/CD Deploy

Workflow деплоя запускается при push в ветку `main` или вручную через `workflow_dispatch`.

### GitHub Secrets
Создай следующие secrets в репозитории GitHub:
- `VPS_HOST` — IP сервера (например, `45.130.212.122`)
- `VPS_USER` — пользователь для SSH (например, `root`)
- `VPS_PORT` — SSH порт (например, `22`)
- `VPS_SSH_KEY` — приватный SSH ключ (PEM)
- `VPS_PATH` — путь деплоя (например, `/var/www/todolist`)

### SSH ключ для деплоя
Сгенерируй ключ локально:
```bash
ssh-keygen -t ed25519 -C "github-actions" -f ~/.ssh/todolist_deploy
```
Добавь публичный ключ на сервер в `~/.ssh/authorized_keys`:
```bash
cat ~/.ssh/todolist_deploy.pub | ssh -p 22 root@45.130.212.122 "mkdir -p ~/.ssh && cat >> ~/.ssh/authorized_keys"
```
Затем создай secret `VPS_SSH_KEY` и вставь туда содержимое приватного ключа `~/.ssh/todolist_deploy`.

### Ручной запуск
GitHub → Actions → `Deploy SPA to VPS` → Run workflow.

## API routing (dev/prod)

- Dev: запросы идут на `/api/*`, Vite proxy прокидывает на `https://social-network.samuraijs.com/api/1.1`.
- Prod: запросы идут на `/api/*`, nginx проксирует на `https://social-network.samuraijs.com/api/1.1`.

### Env
Пример переменных окружения смотри в `.env.example`.
- `VITE_BASE_URL=/api` (можно не задавать, в коде есть fallback на `/api`)
- `VITE_API_KEY=...`

### Локальный запуск
```bash
pnpm install
pnpm run dev
```
