# Strapi 5 — Бэкап базы данных

## Автоматический бэкап (скрипты)

### Windows
```
backup.bat
```

### Linux / Mac
```
chmod +x backup.sh && ./backup.sh
```

Скрипты создают папку `backups/ГГГГ-ММ-ДД_ЧЧ-ММ/` с дампом БД и копией медиафайлов.

---

## Ручные команды

### Бэкап базы данных

**Custom формат (сжатый, рекомендуется):**
```
docker exec project_db pg_dump -U strapi -d strapi -F c > strapi_backup.dump
```

**SQL формат (читаемый):**
```
docker exec -t project_db pg_dump -U strapi -d strapi > strapi_backup.sql
```

### Бэкап медиафайлов

```
xcopy cms\public\uploads uploads_backup\ /E /I
```

### Восстановление базы данных

**Из custom-формата (.dump):**
```
docker exec -i project_db pg_restore -U strapi -d strapi --clean --if-exists < strapi_backup.dump
```

**Из SQL-файла (.sql):**
```
docker exec -i project_db psql -U strapi -d strapi < strapi_backup.sql
```

### Восстановление медиафайлов

```
xcopy uploads_backup cms\public\uploads\ /E /I
```

---

## Параметры подключения к БД

| Параметр      | Значение      |
|---------------|---------------|
| Контейнер     | project_db    |
| Хост          | 127.0.0.1     |
| Порт          | 5432          |
| База данных   | strapi        |
| Пользователь  | strapi        |
| Пароль        | strapi        |

## Требования

- Docker Desktop запущен
- Контейнер `project_db` работает (`docker compose up -d`)
- Команда `pg_dump` / `pg_restore` доступна внутри контейнера PostgreSQL