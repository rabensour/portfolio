@echo off
echo ===================================
echo   Social Media MERN Launcher
echo ===================================
echo.

REM Installer concurrently si nécessaire
if not exist "node_modules\concurrently" (
    echo Installation de concurrently...
    npm install
    echo.
)

echo Demarrage du serveur et du client...
echo.
npm run dev
