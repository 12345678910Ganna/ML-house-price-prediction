@echo off
start "" "%~dp0run_backend.bat"
timeout /t 3 >nul
start "" "%~dp0run_frontend.bat"