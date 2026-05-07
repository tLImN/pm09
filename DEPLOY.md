# 🚀 Деплой на TimeWeb VPS

Пошаговая инструкция по переносу проекта на сервер TimeWeb.

---

## 1. Заказ сервера

На [timeweb.cloud](https://timeweb.cloud) заказать:
- **Cloud VPS**: Ubuntu 22.04/24.04, 4 GB RAM, 40+ GB SSD
- **Публичный IP**: обязательно ✅
- **Бэкапы**: рекомендуется ✅

---

## 2. Первое подключение

```bash
ssh root@<IP_ВАШЕГО_СЕРВЕРА>
```

---

## 3. Базовая настройка сервера

```bash
# Обновление системы
apt update && apt upgrade -y

# Установка Git
apt install -y git
```

---

## 4. Клонирование проекта

```bash
cd /opt
git clone https://YOUR_TOKEN@github.com/tLImN/pm09.git project
cd project
```

---

## 5. Настройка сервера (автоматическая)

> ⚠️ Сначала отредактируйте переменные в начале `server-setup.sh`:
> - `DOMAIN` — ваш домен (например `aforklift.ru`)
> - `EMAIL` — email для SSL-сертификата

```bash
nano server-setup.sh
# Измените DOMAIN, EMAIL в начале файла
# Ctrl+O → Enter → Ctrl+X

chmod +x server-setup.sh
sudo ./server-setup.sh
```

Скрипт автоматически:
1. ✅ Установит Node.js 20, Docker, Nginx
2. ✅ Запустит PostgreSQL через Docker
3. ✅ Сгенерирует секретные ключи (cms/.env)
4. ✅ Установит зависимости и соберёт проект
5. ✅ Создаст systemd-сервисы (автозапуск)
6. ✅ Настроит Nginx (reverse proxy)
7. ✅ Установит SSL-сертификат (HTTPS)
8. ✅ Настроит файрвол

---

## 6. Настройка DNS

В панели управления доменом добавить A-записи:

| Тип | Имя | Значение |
|---|---|---|
| A | `@` | `<IP_СЕРВЕРА>` |
| A | `www` | `<IP_СЕРВЕРА>` |

> ⚠️ DNS-записи могут обновляться до 24 часов, обычно 1-2 часа.

---

## 7. Создание администратора Strapi

После запуска сервера откройте:
```
http://<IP_СЕРВЕРА>:1337/admin
```

Создайте первого администратора (логин/пароль).

---

## 8. Перенос данных (если есть локальные данные)

### Через Strapi Data Transfer (рекомендуется)

**На локальной машине:**
```bash
cd cms
npx strapi export --no-encrypt -f backup
```

**Скопировать файл на сервер:**
```bash
scp backup.tar.gz root@<IP>:/opt/project/cms/
```

**На сервере:**
```bash
cd /opt/project/cms
npx strapi import -f backup.tar.gz
```

### Через pg_dump (для PostgreSQL напрямую)

**На локальной машине:**
```bash
docker exec project_db pg_dump -U strapi strapi > dump.sql
```

**На сервере:**
```bash
# Скопировать
scp dump.sql root@<IP>:/opt/project/

# Импортировать
docker exec -i project_db psql -U strapi strapi < /opt/project/dump.sql
```

### Копирование медиафайлов (изображения товаров)

```bash
# С локальной машины на сервер
scp -r cms/public/uploads root@<IP>:/opt/project/cms/public/
```

---

## 9. Обновление проекта (после изменений в коде)

### Вариант A: Через deploy-скрипт (на сервере)

```bash
cd /opt/project
./deploy.sh
```

### Вариант B: Вручную

```bash
cd /opt/project
git pull origin main

cd cms && npm install && npm run build
sudo systemctl restart strapi

cd ../web && npm install && npm run build
sudo systemctl restart nextjs
```

---

## Полезные команды

```bash
# Статус сервисов
sudo systemctl status strapi
sudo systemctl status nextjs
sudo systemctl status nginx

# Просмотр логов
sudo journalctl -u strapi -f    # логи Strapi (в реальном времени)
sudo journalctl -u nextjs -f    # логи Next.js
sudo tail -f /var/log/nginx/error.log  # логи Nginx

# Перезапуск сервисов
sudo systemctl restart strapi
sudo systemctl restart nextjs
sudo systemctl restart nginx

# Перезапуск PostgreSQL (Docker)
cd /opt/project && docker compose restart

# Проверка Docker контейнеров
docker ps
```

---

## Структура на сервере

```
/opt/project/
├── cms/                    # Strapi CMS
│   ├── .env                # Конфигурация (секреты, БД)
│   ├── public/uploads/     # Загруженные изображения
│   └── ...
├── web/                    # Next.js Frontend
│   ├── .env.local          # Конфигурация
│   └── ...
├── docker-compose.yml      # PostgreSQL
├── server-setup.sh         # Первоначальная настройка
├── deploy.sh               # Обновление проекта
└── setup.sh                # Базовая инициализация
```

---

## Troubleshooting

### Strapi не запускается
```bash
sudo journalctl -u strapi --no-pager -n 50
# Проверить cms/.env — правильные ли пароли БД
```

### Next.js не собирается
```bash
cd /opt/project/web && npm run build
# Смотреть ошибки в выводе
```

### Nginx 502 Bad Gateway
```bash
sudo systemctl status strapi   # запущен ли Strapi?
sudo systemctl status nextjs   # запущен ли Next.js?
```

### SSL не работает
```bash
sudo certbot renew --dry-run
sudo certbot --nginx -d your-domain.ru -d www.your-domain.ru
