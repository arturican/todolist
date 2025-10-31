# ---------- Сборка (pnpm) ----------
FROM node:20-alpine AS build
WORKDIR /app

# Включаем corepack и pnpm
RUN corepack enable

# Ставим зависимости строго по lock-файлу
COPY pnpm-lock.yaml package.json ./
RUN pnpm install --frozen-lockfile

# Копируем остальной код и собираем Vite
COPY . .
# Если приложение должно открываться НЕ с корня (например /app/), добавь base:
# RUN pnpm build -- --base=/app/
RUN pnpm build

# ---------- Релиз (Nginx) ----------
FROM nginx:1.27-alpine

# Конфиг для SPA (+ history fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Скопируем сборку
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
