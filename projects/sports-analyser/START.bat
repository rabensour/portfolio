@echo off
echo.
echo ========================================
echo   SPORTS ANALYSER - Demarrage
echo ========================================
echo.
cd /d "%~dp0"
echo Installation des dependances...
call npm install --silent
echo.
echo Lancement du serveur...
echo.
echo Interface disponible sur: http://localhost:3000
echo Ou ouvrez: index.html
echo.
echo Appuyez sur CTRL+C pour arreter
echo.
call npm run dev
pause
