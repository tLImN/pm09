#!/bin/bash
# ===========================================
# Deploy Script for Production Server
# ===========================================
# Usage: chmod +x deploy.sh && ./deploy.sh
# Run this on the server (e.g., TimeWeb VPS)

set -e

echo "🚀 Starting deployment..."

PROJECT_DIR="/opt/project"
CMS_DIR="$PROJECT_DIR/cms"
WEB_DIR="$PROJECT_DIR/web"

# 1. Pull latest code
echo "📥 Pulling latest code..."
cd "$PROJECT_DIR"
git pull origin main

# 2. Rebuild and restart CMS
echo "🔨 Building CMS (Strapi)..."
cd "$CMS_DIR"
npm install --production=false
npm run build

echo "🔄 Restarting Strapi..."
sudo systemctl restart strapi

# 3. Rebuild and restart Frontend
echo "🔨 Building Frontend (Next.js)..."
cd "$WEB_DIR"
npm install --production=false
npm run build

echo "🔄 Restarting Next.js..."
sudo systemctl restart nextjs

# 4. Reload Nginx (in case config changed)
echo "🔄 Reloading Nginx..."
sudo systemctl reload nginx

echo ""
echo "==========================================="
echo "✅ Deployment complete!"
echo "==========================================="
echo ""
echo "Check status:"
echo "  sudo systemctl status strapi"
echo "  sudo systemctl status nextjs"
echo "  sudo systemctl status nginx"
echo ""