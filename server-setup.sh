#!/bin/bash
# ===========================================
# Server Setup Script (TimeWeb VPS / Ubuntu)
# ===========================================
# Run ONCE after initial deployment:
#   chmod +x server-setup.sh && sudo ./server-setup.sh

set -e

# ── Configuration ──────────────────────────
# CHANGE THESE to your actual values:
DOMAIN="7829960-zf629738.twc1.net"          # your main domain
EMAIL="admin@7829960-zf629738.twc1.net"     # email for Let's Encrypt
# === ВРЕМЕННО: поставить true при покупке домена с поддержкой SSL ===
ENABLE_SSL=false
# ───────────────────────────────────────────

PROJECT_DIR="/opt/project"
CMS_DIR="$PROJECT_DIR/cms"
WEB_DIR="$PROJECT_DIR/web"

echo "🔧 Server setup starting..."

# 1. System updates
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# 2. Install Node.js 20
echo "📦 Installing Node.js 20..."
if ! command -v node &> /dev/null; then
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt install -y nodejs
fi
echo "   Node: $(node -v) | npm: $(npm -v)"

# 3. Install Docker
echo "📦 Installing Docker..."
if ! command -v docker &> /dev/null; then
    apt install -y docker.io docker-compose-plugin
    systemctl enable docker && systemctl start docker
fi

# 4. Install Nginx
echo "📦 Installing Nginx..."
apt install -y nginx
systemctl enable nginx

# 5. Run project setup (generates .env, starts DB, installs deps)
echo "🚀 Running project setup..."
cd "$PROJECT_DIR"
chmod +x setup.sh
./setup.sh

# 6. Update FRONTEND_URL in cms/.env
echo "📝 Updating cms/.env for production..."
if [ "$ENABLE_SSL" = "false" ]; then
    # === ВРЕМЕННО: http:// вместо https:// (удалить при покупке домена) ===
    sed -i "s|FRONTEND_URL=.*|FRONTEND_URL=http://$DOMAIN|" "$CMS_DIR/.env"
else
    sed -i "s|FRONTEND_URL=.*|FRONTEND_URL=https://$DOMAIN|" "$CMS_DIR/.env"
fi

# 7. Update web/.env.local
echo "📝 Updating web/.env.local for production..."
if [ "$ENABLE_SSL" = "false" ]; then
    # === ВРЕМЕННО: http:// вместо https:// (удалить при покупке домена) ===
    sed -i "s|NEXT_PUBLIC_STRAPI_URL=.*|NEXT_PUBLIC_STRAPI_URL=http://$DOMAIN|" "$WEB_DIR/.env.local"
else
    sed -i "s|NEXT_PUBLIC_STRAPI_URL=.*|NEXT_PUBLIC_STRAPI_URL=https://$DOMAIN|" "$WEB_DIR/.env.local"
fi
# STRAPI_INTERNAL_URL всегда localhost — серверные API-роуты ходят напрямую
if ! grep -q "STRAPI_INTERNAL_URL" "$WEB_DIR/.env.local"; then
    echo "STRAPI_INTERNAL_URL=http://127.0.0.1:1337" >> "$WEB_DIR/.env.local"
fi

# 8. Build for production
echo "🔨 Building CMS..."
cd "$CMS_DIR"
npm run build

echo "🔨 Building Frontend..."
cd "$WEB_DIR"
npm run build

# 9. Create systemd service for Strapi
echo "⚙️  Creating Strapi systemd service..."
cat > /etc/systemd/system/strapi.service << EOF
[Unit]
Description=Strapi CMS
After=network.target docker.service

[Service]
Type=simple
User=root
WorkingDirectory=$CMS_DIR
ExecStart=$(which node) node_modules/.bin/strapi start
Restart=always
Environment=NODE_ENV=production
EnvironmentFile=$CMS_DIR/.env

[Install]
WantedBy=multi-user.target
EOF

# 10. Create systemd service for Next.js
echo "⚙️  Creating Next.js systemd service..."
cat > /etc/systemd/system/nextjs.service << EOF
[Unit]
Description=Next.js Frontend
After=network.target

[Service]
Type=simple
User=root
WorkingDirectory=$WEB_DIR
ExecStart=$(which node) node_modules/.bin/next start -p 3000
Restart=always
Environment=NODE_ENV=production
EnvironmentFile=$WEB_DIR/.env.local

[Install]
WantedBy=multi-user.target
EOF

# 11. Create Nginx config
echo "⚙️  Configuring Nginx..."

# === ВРЕМЕННО: генерация самоподписанного сертификата (удалить при покупке домена) ===
if [ "$ENABLE_SSL" = "false" ]; then
    echo "🔒 Generating self-signed certificate for HTTPS redirect..."
    mkdir -p /etc/nginx/ssl
    openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
        -keyout /etc/nginx/ssl/self-signed.key \
        -out /etc/nginx/ssl/self-signed.crt \
        -subj "/CN=$DOMAIN"
fi

cat > /etc/nginx/sites-available/project << 'MAINEOF'

map $http_upgrade $connection_upgrade {
    default upgrade;
    ''      close;
}

MAINEOF

cat >> /etc/nginx/sites-available/project << EOF
# Main domain — Strapi API (/api/) + Next.js frontend (/)
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    client_max_body_size 50M;

    # Timeouts & buffers для стабильной работы админки
    proxy_connect_timeout 60s;
    proxy_send_timeout    120s;
    proxy_read_timeout    120s;
    proxy_buffer_size     128k;
    proxy_buffers         4 256k;
    proxy_busy_buffers_size 256k;

    # Next.js API routes (ДОЛЖНЫ идти ПЕРЕД Strapi /api/)
    location /api/send-contact {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /api/preview {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    location /api/disable-draft {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Strapi Admin Panel — proxied through standard port 80
    # ДОЛЖЕН идти ПЕРЕД /api/ чтобы /admin/content-type-builder и т.п. работали
    location /admin {
        proxy_pass http://127.0.0.1:1337/admin;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \$connection_upgrade;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Strapi internal API paths (content-type-builder, upload, users-permissions, i18n и т.д.)
    # Эти пути вызываются админкой напрямую, НЕ через /api/
    location ~ ^/(content-type-builder|upload|users-permissions|i18n|content-manager|email|documentation|graphql) {
        proxy_pass http://127.0.0.1:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \$connection_upgrade;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Strapi API — proxied under /api/
    location /api/ {
        proxy_pass http://127.0.0.1:1337/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \$connection_upgrade;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Strapi uploads (public files)
    location /uploads/ {
        proxy_pass http://127.0.0.1:1337/uploads/;
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Next.js Frontend — everything else
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection \$connection_upgrade;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}

EOF

# === ВРЕМЕННО: добавить HTTPS→HTTP redirect (удалить при покупке домена) ===
if [ "$ENABLE_SSL" = "false" ]; then
    cat >> /etc/nginx/sites-available/project << 'SSLEOF'

# === ВРЕМЕННО: HTTPS→HTTP redirect (удалить при покупке домена) ===
# Слушаем 443 с самоподписанным сертификатом и редиректим на http://
SSLEOF

    cat >> /etc/nginx/sites-available/project << EOF
server {
    listen 443 ssl;
    server_name $DOMAIN www.$DOMAIN;

    ssl_certificate     /etc/nginx/ssl/self-signed.crt;
    ssl_certificate_key /etc/nginx/ssl/self-signed.key;

    # Редирект всех HTTPS-запросов на HTTP
    return 301 http://\$host\$request_uri;
}
EOF
fi

# Enable site, remove default
ln -sf /etc/nginx/sites-available/project /etc/nginx/sites-enabled/project
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

# 12. Start services
echo "🚀 Starting services..."
systemctl daemon-reload
systemctl enable strapi nextjs
systemctl start strapi nextjs

# 13. Install SSL
if [ "$ENABLE_SSL" = "true" ]; then
    echo "🔒 Installing SSL certificate..."
    apt install -y certbot python3-certbot-nginx
    certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m "$EMAIL"
else
    # === ВРЕМЕННО: пропускаем certbot (удалить при покупке домена) ===
    echo "⏭️  Skipping SSL certificate (ENABLE_SSL=false)"
fi

# 14. Firewall
echo "🛡️  Configuring firewall..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo ""
echo "==========================================="
echo "✅ Server setup complete!"
echo "==========================================="
if [ "$ENABLE_SSL" = "false" ]; then
    echo ""
    echo "  ⚠️  SSL отключён (ENABLE_SSL=false)"
    echo "  Frontend:  http://$DOMAIN"
    echo "  CMS Admin: http://$DOMAIN/admin"
    echo ""
    echo "  При покупке домена: поставьте ENABLE_SSL=true и перезапустите скрипт"
else
    echo ""
    echo "  Frontend:  https://$DOMAIN"
    echo "  CMS Admin: https://$DOMAIN/admin"
fi
echo ""
echo "Services:"
echo "  sudo systemctl status strapi"
echo "  sudo systemctl status nextjs"
echo "  sudo systemctl status nginx"
echo ""
echo "To update later, run:"
echo "  cd $PROJECT_DIR && ./deploy.sh"
echo ""