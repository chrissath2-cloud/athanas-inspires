@echo off
title Athanas Inspires - First Time Setup
echo Installing the website building tools...
npm install
if errorlevel 1 (echo. & echo SETUP FAILED. Read guides\TROUBLESHOOTING.md & pause & exit /b 1)
echo.
echo SETUP COMPLETE. You can now double-click UPDATE WEBSITE.bat.
pause
