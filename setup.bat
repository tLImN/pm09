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

REM 3. Generate random secrets for Strapi
echo 🔐 Generating random secrets...

for /f "delims=" %%i in ('powershell -NoProfile -Command "[Convert]::ToBase64String([byte[]]::new(32))"') do set API_TOKEN_SALT=%%i
for /f "delims=" %%i in ('powershell -NoProfile -Command "[Convert]::ToBase64String([byte[]]::new(32))"') do set ADMIN_JWT_SECRET=%%i
for /f "delims=" %%i in ('powershell -NoProfile -Command "[Convert]::ToBase64String([byte[]]::new(32))"') do set TRANSFER_TOKEN_SALT=%%i
for /f "delims=" %%i in ('powershell -NoProfile -Command "[Convert]::ToBase64String([byte[]]::new(32))"') do set JWT_SECRET=%%i
for /f "delims=" %%i in ('powershell -NoProfile -Command "$k1=[Convert]::ToBase64String([byte[]]::new(32));$k2=[Convert]::ToBase64String([byte[]]::new(32));$k3=[Convert]::ToBase64String([byte[]]::new(32));$k4=[Convert]::ToBase64String([byte[]]::new(32));Write-Host \"$k1,$k2,$k3,$k4\" "') do set APP_KEYS=%%i

powershell -NoProfile -Command ^
    "(Get-Content cms\.env) | ForEach-Object { $_ -replace 'API_TOKEN_SALT=.*', 'API_TOKEN_SALT=%API_TOKEN_SALT%' -replace 'ADMIN_JWT_SECRET=.*', 'ADMIN_JWT_SECRET=%ADMIN_JWT_SECRET%' -replace 'TRANSFER_TOKEN_SALT=.*', 'TRANSFER_TOKEN_SALT=%TRANSFER_TOKEN_SALT%' -replace 'JWT_SECRET=.*', 'JWT_SECRET=%JWT_SECRET%' -replace 'APP_KEYS=.*', 'APP_KEYS=%APP_KEYS%' } | Set-Content cms\.env"

echo ✅ Secrets generated and saved to cms\.env

REM 4. Start PostgreSQL via Docker
echo 🐘 Starting PostgreSQL database...
docker-compose up -d

echo ⏳ Waiting for database to be ready...
timeout /t 5 /nobreak >nul

REM 5. Install dependencies
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