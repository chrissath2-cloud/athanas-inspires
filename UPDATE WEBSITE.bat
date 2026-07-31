@echo off
title Athanas Inspires - Update Website
echo Building a fresh website folder...
npm run build
if errorlevel 1 (echo. & echo UPDATE FAILED. Read the clear error above and guides\TROUBLESHOOTING.md & pause & exit /b 1)
echo.
echo UPDATE COMPLETE. Open website\index.html or double-click OPEN WEBSITE.bat.
pause
