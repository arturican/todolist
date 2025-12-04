Веб-приложение для управления задачами, разработанное на React
с использованием функциональных компонентов и хуков.
Подходит для изучения архитектуры фронтенд-приложений и работы с состоянием.

## Secrets via Doppler

Фронтенд использует только переменные `VITE_API_TOKEN`, `VITE_API_KEY` и `VITE_BASE_URL`. Они хранятся в [Doppler](https://www.doppler.com/) и автоматически подмешиваются в dev/build при помощи CLI (`doppler run`).

### Настройка

1. Установите Doppler CLI (например, `brew install dopplerhq/cli/doppler` или `curl -Ls https://cli.doppler.com/install.sh | sh`).
2. Создайте проект `todolist` (или используйте своё имя) и configs `dev`/`prod`. Заведите в каждом значения для `VITE_API_TOKEN`, `VITE_API_KEY`, `VITE_BASE_URL`.
3. Скопируйте `doppler.yaml.example` в `doppler.yaml` и при необходимости поменяйте slug проекта/конфигов. Либо выполните `doppler setup` внутри репозитория.
4. Локальные оверрайды можно держать в `.env` (см. `.env.example`), но наоборот не коммитить реальные секреты.

### Использование

- `pnpm doppler:dev` — запускает Vite dev server с секретами из конфигурации `dev`.
- `pnpm doppler:test` — выполняет Vitest с теми же секретами.
- `pnpm doppler:build` или `pnpm deploy` — собирают production-бандл, подставляя переменные из `prod`.
- `pnpm doppler:env:dev` / `pnpm doppler:env:prod` — выгружают секреты в локальный `.env` (полезно для CI перед `pnpm build`).

`pnpm dev`, `pnpm test` и `pnpm build` продолжают работать и читают `.env`, если Doppler недоступен. Перед деплоем проверяйте, что конфиги Doppler содержат только значения с префиксом `VITE_`, иначе секрет попадёт в бандл.

### Пример CI шага

```yaml
- name: Install Doppler
  run: curl -Ls https://cli.doppler.com/install.sh | sudo sh
- name: Export secrets to .env
  env:
    DOPPLER_TOKEN: ${{ secrets.DOPPLER_TOKEN }}
  run: doppler secrets download --token "$DOPPLER_TOKEN" --config prod --format env --no-file > .env
- name: Build
  run: pnpm install && pnpm build
```

Если runner поддерживает прямой запуск команд из Doppler, можно заменить шаг экспорта на `doppler run --token "$DOPPLER_TOKEN" --config prod -- pnpm build`. В обоих случаях `.env` существует только во время job и деплоится вместе с артефактами.
