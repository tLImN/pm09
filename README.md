# Forklift Equipment Catalog

Веб-приложение для каталога складской техники.

- **Frontend:** Next.js 16 (TypeScript, Tailwind CSS v4, React 19)
- **Backend (CMS):** Strapi v5.38
- **Database:** PostgreSQL 16 (Docker)

---

## 📋 Предварительные требования

- [Node.js](https://nodejs.org/) v20 или выше
- [npm](https://www.npmjs.com/) v6 или выше
- [Docker](https://www.docker.com/) и Docker Compose

---

## Быстрый старт

### Автоматическая установка

**Linux / macOS:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```cmd
setup.bat
```

Скрипт автоматически:
1. Проверит наличие Docker, Node.js, npm
2. Создаст файлы `.env` из примеров
3. Сгенерирует секретные ключи для Strapi
4. Запустит PostgreSQL через Docker
5. Установит зависимости для CMS и Frontend

---

### Ручная установка

#### 1. Запуск базы данных

```bash
docker compose up -d
```

#### 2. Настройка Strapi (CMS)

```bash
cd cms

# Скопировать пример конфигурации
cp .env.example .env
# (или: copy .env.example .env  на Windows)

# Установить зависимости
npm install

# Запустить в режиме разработки
npm run develop
```

При первом запуске откроется страница создания администратора:
- **URL:** http://localhost:1337/admin

#### 3. Настройка Frontend (Web)

```bash
cd web

# Скопировать пример конфигурации
cp .env.example .env.local
# (или: copy .env.example .env.local  на Windows)

# Установить зависимости
npm install

# Запустить в режиме разработки
npm run dev
```

- **URL:** http://localhost:3000

---

## Структура проекта

```
project/
├── cms/                    # Strapi CMS (бэкенд)
│   ├── config/             # Конфигурация Strapi
│   ├── database/           # Миграции базы данных
│   ├── src/                # Исходный код CMS
│   ├── .env.example        # Пример переменных окружения
│   └── package.json
│
├── web/                    # Next.js (фронтенд)
│   ├── app/                # Страницы и layouts (App Router)
│   ├── components/         # React-компоненты
│   ├── lib/                # Утилиты и API-клиент
│   ├── .env.example        # Пример переменных окружения
│   └── package.json
│
├── draft_htmlcss/          # Черновые HTML/CSS макеты
│
├── docker-compose.yml      # Конфигурация Docker (PostgreSQL)
├── setup.sh                # Скрипт установки (Linux/macOS)
├── setup.bat               # Скрипт установки (Windows)
├── backup.sh               # Бэкап БД + медиа (Linux/macOS)
├── backup.bat              # Бэкап БД + медиа (Windows)
├── BACKUP.md               # Документация по бэкапам
├── .gitignore              # Исключения для Git
└── README.md               # Этот файл
```

---

## Переменные окружения

### Strapi (`cms/.env`)

| Переменная | Описание |
|---|---|
| `HOST` | Хост сервера (0.0.0.0) |
| `PORT` | Порт (1337) |
| `APP_KEYS` | Ключи приложения (через запятую) |
| `API_TOKEN_SALT` | Соль для API-токенов |
| `ADMIN_JWT_SECRET` | Секрет для JWT админки |
| `TRANSFER_TOKEN_SALT` | Соль для токенов переноса |
| `JWT_SECRET` | Секрет для JWT |
| `DATABASE_CLIENT` | Клиент БД (postgres) |
| `DATABASE_HOST` | Хост БД (localhost) |
| `DATABASE_PORT` | Порт БД (5432) |
| `DATABASE_NAME` | Имя БД (strapi) |
| `DATABASE_USERNAME` | Пользователь БД |
| `DATABASE_PASSWORD` | Пароль БД |
| `ENCRYPTION_KEY` | Ключ шифрования |
| `PREVIEW_SECRET` | Секрет для Strapi Preview (должен совпадать с `STRAPI_PREVIEW_SECRET` во фронтенде) |
| `FRONTEND_URL` | URL фронтенда (http://localhost:3000) |

### Frontend (`web/.env.local`)

| Переменная | Описание |
|---|---|
| `NEXT_PUBLIC_STRAPI_URL` | URL Strapi API (http://localhost:1337) |
| `STRAPI_PREVIEW_SECRET` | Секрет для Draft Mode / Preview (должен совпадать с `PREVIEW_SECRET` в CMS) |

---

## Полезные команды

```bash
# Пересоздать базу данных (сброс данных)
docker compose down -v
docker compose up -d

# Сборка CMS для продакшена
cd cms && npm run build

# Сборка фронтенда для продакшена
cd web && npm run build

# Проверка уязвимостей
cd cms && npm audit
cd web && npm audit

# Бэкап БД и медиафайлов (pg_dump + копирование uploads)
# Linux / macOS:
./backup.sh
# Windows:
backup.bat
# (подробнее в BACKUP.md)

# Экспорт данных через Strapi Data Transfer
npx strapi export --no-encrypt -f my-backup
npx strapi export --encrypt -f my-backup --key mySecretKey

# Импорт данных через Strapi Data Transfer
npx strapi import -f my-backup.tar.gz
npx strapi import -f my-backup.tar.gz --key mySecretKey
```

---

## Примечания

- Файлы `.env` не попадают в Git (добавлены в `.gitignore`).
- При развёртывании на другом компьютере достаточно клонировать репозиторий и запустить `setup.sh` / `setup.bat`.