@echo off
echo Installation des packages...
python3 -m pip install openai python-dotenv --quiet

echo.
echo Lancement de l'analyse...
python3 analyze_reviews.py

pause
