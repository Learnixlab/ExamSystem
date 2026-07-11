@echo off
title MCQ Exam System - Local Server
cd /d "%~dp0"

echo ============================================
echo   MCQ Exam System - Starting local server
echo ============================================
echo.

where python >nul 2>nul
if %errorlevel%==0 (
    echo Starting server with Python...
    start "" http://localhost:8000/index.html
    python -m http.server 8000
    goto :eof
)

where python3 >nul 2>nul
if %errorlevel%==0 (
    echo Starting server with Python3...
    start "" http://localhost:8000/index.html
    python3 -m http.server 8000
    goto :eof
)

where npx >nul 2>nul
if %errorlevel%==0 (
    echo Python not found. Starting server with Node.js (npx)...
    start "" http://localhost:8000/index.html
    npx --yes http-server -p 8000
    goto :eof
)

echo.
echo ERROR: Neither Python nor Node.js was found on this computer.
echo Please install Python from https://www.python.org/downloads/
echo ^(during install, check "Add Python to PATH"^) and run this file again.
echo.
pause
