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
sed -i "s|FRONTEND_URL=.*|FRONTEND_URL=https://$DOMAIN|" "$CMS_DIR/.env"

# 7. Update web/.env.local
echo "📝 Updating web/.env.local for production..."
sed -i "s|NEXT_PUBLIC_STRAPI_URL=.*|NEXT_PUBLIC_STRAPI_URL=https://$DOMAIN|" "$WEB_DIR/.env.local"

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
cat > /etc/nginx/sites-available/project << EOF
# Main domain — Strapi API (/api/) + Next.js frontend (/)
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    client_max_body_size 50M;

    # Strapi API — proxied under /api/
    location /api/ {
        proxy_pass http://127.0.0.1:1337/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }

    # Strapi uploads
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
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
    }
}
EOF

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
echo "🔒 Installing SSL certificate..."
apt install -y certbot python3-certbot-nginx
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos -m "$EMAIL"

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
echo ""
echo "  Frontend:  https://$DOMAIN"
echo "  CMS Admin: http://$DOMAIN:1337/admin  (direct, no SSL)"
echo ""
echo "Services:"
echo "  sudo systemctl status strapi"
echo "  sudo systemctl status nextjs"
echo "  sudo systemctl status nginx"
echo ""
echo "To update later, run:"
echo "  cd $PROJECT_DIR && ./deploy.sh"
echo ""