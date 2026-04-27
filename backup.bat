@echo off
chcp 65001 >nul
setlocal enabledelayedexpansion

:: ============================================
:: Strapi 5 Database & Media Backup Script
:: ============================================

:: Настройки
set DB_CONTAINER=project_db
set DB_USER=strapi
set DB_NAME=strapi
set UPLOADS_DIR=cms\public\uploads

:: Формируем метку времени (ГГГГ-ММ-ДД_ЧЧ-ММ)
for /f "tokens=2 delims==" %%I in ('wmic os get localdatetime /value') do set datetime=%%I
set TIMESTAMP=%datetime:~0,4%-%datetime:~4,2%-%datetime:~6,2%_%datetime:~8,2%-%datetime:~10,2%

:: Папка для бэкапов
set BACKUP_DIR=backups\%TIMESTAMP%
if not exist "%BACKUP_DIR%" mkdir "%BACKUP_DIR%"

echo ============================================
echo  Strapi 5 Backup
echo  Время: %TIMESTAMP%
echo ============================================
echo.

:: 1. Проверяем, запущен ли контейнер
echo [1/3] Проверка контейнера %DB_CONTAINER%...
docker ps --format "table {{.Names}}" | findstr /B /C:"%DB_CONTAINER%" >nul 2>&1
if errorlevel 1 (
    echo ОШИБКА: Контейнер %DB_CONTAINER% не запущен!
    echo Запустите: docker compose up -d
    exit /b 1
)
echo       Контейнер найден.
echo.

:: 2. Бэкап базы данных (pg_dump stdout -> файл)
echo [2/3] Создание бэкапа базы данных...
set DB_DUMP=%BACKUP_DIR%\strapi_db_%TIMESTAMP%.dump
docker exec %DB_CONTAINER% pg_dump -U %DB_USER% -d %DB_NAME% -F c > "%DB_DUMP%"
if errorlevel 1 (
    echo ОШИБКА: Не удалось создать дамп базы данных!
    exit /b 1
)
echo       Бэкап БД: %DB_DUMP%
echo.

:: 3. Бэкап медиафайлов
echo [3/3] Копирование медиафайлов...
set UPLOADS_BACKUP=%BACKUP_DIR%\uploads
if exist "%UPLOADS_DIR%" (
    xcopy "%UPLOADS_DIR%" "%UPLOADS_BACKUP%\" /E /I /Q >nul
    echo       Медиафайлы: %UPLOADS_BACKUP%\
) else (
    echo       Папка uploads не найдена, пропускаем.
)
echo.

echo ============================================
echo  Бэкап завершён!
echo  Папка: %BACKUP_DIR%
echo ============================================
echo.
echo Для восстановления БД:
echo   docker exec -i %DB_CONTAINER% pg_restore -U %DB_USER% -d %DB_NAME% --clean --if-exists ^< "%DB_DUMP%"
echo.

endlocal