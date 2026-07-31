@echo off
title Athanas Inspires - Local Preview
if not exist website\index.html (echo The website has not been built yet. Run UPDATE WEBSITE.bat first. & pause & exit /b 1)
node scripts\preview.js
pause
