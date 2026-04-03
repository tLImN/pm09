#!/bin/bash
# ===========================================
# Project Setup Script
# ===========================================
# Usage: chmod +x setup.sh && ./setup.sh

set -e

echo "🚀 Starting project setup..."

# 1. Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20+."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm."
    exit 1
fi

echo "✅ Prerequisites OK"

# 2. Setup environment files
echo "📝 Setting up environment files..."

if [ ! -f cms/.env ]; then
    cp cms/.env.example cms/.env
    echo "✅ Created cms/.env from example"
else
    echo "⏭️  cms/.env already exists, skipping"
fi

if [ ! -f web/.env.local ]; then
    cp web/.env.example web/.env.local
    echo "✅ Created web/.env.local from example"
else
    echo "⏭️  web/.env.local already exists, skipping"
fi

# 3. Generate random secrets for Strapi
echo "🔐 Generating random secrets..."

API_TOKEN_SALT=$(openssl rand -base64 32)
ADMIN_JWT_SECRET=$(openssl rand -base64 32)
TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
APP_KEYS=$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32),$(openssl rand -base64 32)

# Update cms/.env with generated secrets (macOS/Linux compatible)
if [[ "$OSTYPE" == "darwin"* ]]; then
    sed -i '' "s|API_TOKEN_SALT=.*|API_TOKEN_SALT=$API_TOKEN_SALT|" cms/.env
    sed -i '' "s|ADMIN_JWT_SECRET=.*|ADMIN_JWT_SECRET=$ADMIN_JWT_SECRET|" cms/.env
    sed -i '' "s|TRANSFER_TOKEN_SALT=.*|TRANSFER_TOKEN_SALT=$TRANSFER_TOKEN_SALT|" cms/.env
    sed -i '' "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" cms/.env
    sed -i '' "s|APP_KEYS=.*|APP_KEYS=$APP_KEYS|" cms/.env
else
    sed -i "s|API_TOKEN_SALT=.*|API_TOKEN_SALT=$API_TOKEN_SALT|" cms/.env
    sed -i "s|ADMIN_JWT_SECRET=.*|ADMIN_JWT_SECRET=$ADMIN_JWT_SECRET|" cms/.env
    sed -i "s|TRANSFER_TOKEN_SALT=.*|TRANSFER_TOKEN_SALT=$TRANSFER_TOKEN_SALT|" cms/.env
    sed -i "s|JWT_SECRET=.*|JWT_SECRET=$JWT_SECRET|" cms/.env
    sed -i "s|APP_KEYS=.*|APP_KEYS=$APP_KEYS|" cms/.env
fi

echo "✅ Secrets generated and saved to cms/.env"

# 4. Start PostgreSQL via Docker
echo "🐘 Starting PostgreSQL database..."
docker-compose up -d

echo "⏳ Waiting for database to be ready..."
sleep 5

# 5. Install dependencies
echo "📦 Installing CMS dependencies..."
cd cms && npm install && cd ..

echo "📦 Installing Web dependencies..."
cd web && npm install && cd ..

echo ""
echo "==========================================="
echo "✅ Setup complete!"
echo "==========================================="
echo ""
echo "To start the project:"
echo ""
echo "  Terminal 1 (CMS):"
echo "    cd cms && npm run develop"
echo ""
echo "  Terminal 2 (Web):"
echo "    cd web && npm run dev"
echo ""
echo "  CMS Admin: http://localhost:1337/admin"
echo "  Frontend:  http://localhost:3000"
echo ""
echo "⚠️  First time CMS start will prompt you to create an admin account."
echo ""