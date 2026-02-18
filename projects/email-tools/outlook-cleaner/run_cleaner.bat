@echo off
REM Email Cleaner - Script d'execution rapide pour Windows
REM Double-cliquez sur ce fichier pour nettoyer vos emails

echo.
echo ╔════════════════════════════════════════════════════════════════╗
echo ║                    Email Cleaner                               ║
echo ║            Nettoyage automatique des emails                    ║
echo ╚════════════════════════════════════════════════════════════════╝
echo.

REM Changer vers le dossier du script
cd /d "%~dp0"

echo 📂 Dossier: %CD%
echo.

REM Vérifier si Python est installé
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Python n'est pas installé ou n'est pas dans le PATH
    echo.
    echo Installez Python depuis: https://www.python.org/
    pause
    exit /b 1
)

echo ✅ Python trouvé
echo.

REM Menu de choix
:MENU
echo.
echo Que voulez-vous faire?
echo.
echo 1. Nettoyer Gmail
echo 2. Nettoyer Outlook
echo 3. Nettoyer les deux (Gmail + Outlook)
echo 4. Mode interactif (menu complet)
echo 5. Voir les filtres actuels
echo 6. Ajouter un expéditeur bloqué
echo 7. Quitter
echo.

set /p choice="Choisissez une option (1-7): "

if "%choice%"=="1" (
    echo.
    echo 🔵 Nettoyage de Gmail...
    python clean_emails.py gmail
    goto END
)

if "%choice%"=="2" (
    echo.
    echo 🔷 Nettoyage d'Outlook...
    python clean_emails.py outlook
    goto END
)

if "%choice%"=="3" (
    echo.
    echo 🔵🔷 Nettoyage de Gmail et Outlook...
    python clean_emails.py both
    goto END
)

if "%choice%"=="4" (
    echo.
    echo 📋 Mode interactif...
    python clean_emails.py menu
    goto END
)

if "%choice%"=="5" (
    echo.
    echo 📋 Filtres actuels...
    python clean_emails.py filters
    goto END
)

if "%choice%"=="6" (
    echo.
    echo ➕ Ajouter un expéditeur bloqué...
    python clean_emails.py add-sender
    goto END
)

if "%choice%"=="7" (
    echo.
    echo 👋 Au revoir!
    exit /b 0
)

echo.
echo ❌ Choix invalide
goto MENU

:END
echo.
echo ═══════════════════════════════════════════════════════════════
echo.
pause
