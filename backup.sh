#!/bin/bash
# ============================================
# Strapi 5 Database & Media Backup Script
# ============================================

set -e

# Настройки
DB_CONTAINER="project_db"
DB_USER="strapi"
DB_NAME="strapi"
UPLOADS_DIR="cms/public/uploads"

# Метка времени
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M")

# Папка для бэкапов
BACKUP_DIR="backups/$TIMESTAMP"
mkdir -p "$BACKUP_DIR"

echo "============================================"
echo " Strapi 5 Backup"
echo " Время: $TIMESTAMP"
echo "============================================"
echo ""

# 1. Проверяем, запущен ли контейнер
echo "[1/3] Проверка контейнера $DB_CONTAINER..."
if ! docker ps --format "table {{.Names}}" | grep -q "^${DB_CONTAINER}$"; then
    echo "ОШИБКА: Контейнер $DB_CONTAINER не запущен!"
    echo "Запустите: docker compose up -d"
    exit 1
fi
echo "      Контейнер найден."
echo ""

# 2. Бэкап базы данных (pg_dump stdout -> файл)
echo "[2/3] Создание бэкапа базы данных..."
DB_DUMP="$BACKUP_DIR/strapi_db_${TIMESTAMP}.dump"
docker exec "$DB_CONTAINER" pg_dump -U "$DB_USER" -d "$DB_NAME" -F c > "$DB_DUMP"
echo "      Бэкап БД: $DB_DUMP"
echo ""

# 3. Бэкап медиафайлов
echo "[3/3] Копирование медиафайлов..."
UPLOADS_BACKUP="$BACKUP_DIR/uploads"
if [ -d "$UPLOADS_DIR" ]; then
    cp -r "$UPLOADS_DIR" "$UPLOADS_BACKUP"
    echo "      Медиафайлы: $UPLOADS_BACKUP/"
else
    echo "      Папка uploads не найдена, пропускаем."
fi
echo ""

echo "============================================"
echo " Бэкап завершён!"
echo " Папка: $BACKUP_DIR"
echo "============================================"
echo ""
echo "Для восстановления БД:"
echo "  docker exec -i $DB_CONTAINER pg_restore -U $DB_USER -d $DB_NAME --clean --if-exists < $DB_DUMP"
echo ""