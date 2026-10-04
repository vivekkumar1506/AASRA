@echo off
title AASRA Full Stack Platform
echo ========================================================
echo        AASRA Adoption Platform - Full Stack Server
echo ========================================================
echo.

cd /d "%~dp0"

IF NOT EXIST "venv\Scripts\activate.bat" (
    echo [1/3] Virtual environment not found. Creating venv...
    python -m venv venv
    call venv\Scripts\activate.bat
    echo [2/3] Installing dependencies...
    pip install -r requirements.txt
) ELSE (
    call venv\Scripts\activate.bat
)

IF NOT EXIST ".env" (
    IF EXIST ".env.example" (
        copy .env.example .env >nul
    )
)

echo [3/3] Starting Unified Backend API & Frontend Server on Port 8000...
echo.
echo >> Web Portal:     http://localhost:8000
echo >> Interactive API: http://localhost:8000/docs
echo >> Health Check:   http://localhost:8000/api/health
echo.

start http://localhost:8000
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

pause
