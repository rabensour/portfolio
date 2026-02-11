@echo off
title Veo3 Prompt Optimizer - Web Interface

echo.
echo ============================================================
echo    VEO3 PROMPT OPTIMIZER - INTERFACE WEB
echo ============================================================
echo.

echo [1/3] Verification de Python...
py --version 2>nul | findstr /R "Python 3" >nul
if %errorlevel% neq 0 (
    echo ERREUR: Python 3 non trouve
    echo.
    echo Installez Python 3: https://www.python.org/downloads/
    pause
    exit /b 1
)
echo OK: Python 3 detecte

echo.
echo [2/3] Installation de Flask (si necessaire)...
py -m pip show flask >nul 2>&1
if %errorlevel% neq 0 (
    echo Installation de Flask...
    py -m pip install flask
) else (
    echo OK: Flask deja installe
)

echo.
echo [3/3] Lancement du serveur web...
echo.
echo ============================================================
echo    Interface web: http://localhost:5000
echo ============================================================
echo.
echo Appuyez sur Ctrl+C pour arreter le serveur
echo.

py app.py

pause
