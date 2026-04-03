@echo off
REM ===========================================
REM Project Setup Script (Windows)
REM ===========================================
REM Usage: setup.bat

echo 🚀 Starting project setup...

REM 1. Check prerequisites
echo 📋 Checking prerequisites...

where docker >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker Desktop first.
    pause
    exit /b 1
)

where node >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js 20+.
    pause
    exit /b 1
)

where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ npm is not installed. Please install npm.
    pause
    exit /b 1
)

echo ✅ Prerequisites OK

REM 2. Setup environment files
echo 📝 Setting up environment files...

if not exist cms\.env (
    copy cms\.env.example cms\.env
    echo ✅ Created cms\.env from example
) else (
    echo ⏭️  cms\.env already exists, skipping
)

if not exist web\.env.local (
    copy web\.env.example web\.env.local
    echo ✅ Created web\.env.local from example
) else (
    echo ⏭️  web\.env.local already exists, skipping
)

REM 3. Start PostgreSQL via Docker
echo 🐘 Starting PostgreSQL database...
docker-compose up -d

echo ⏳ Waiting for database to be ready...
timeout /t 5 /nobreak >nul

REM 4. Install dependencies
echo 📦 Installing CMS dependencies...
cd cms
call npm install
cd ..

echo 📦 Installing Web dependencies...
cd web
call npm install
cd ..

echo.
echo ===========================================
echo ✅ Setup complete!
echo ===========================================
echo.
echo To start the project:
echo.
echo   Terminal 1 (CMS):
echo     cd cms ^&^& npm run develop
echo.
echo   Terminal 2 (Web):
echo     cd web ^&^& npm run dev
echo.
echo   CMS Admin: http://localhost:1337/admin
echo   Frontend:  http://localhost:3000
echo.
echo ⚠️  First time CMS start will prompt you to create an admin account.
echo.
pause