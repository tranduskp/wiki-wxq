@echo off
rem Serves the site at http://localhost:8080 (needs Python 3).
cd /d "%~dp0"
py scripts\serve.py 8080 || python scripts\serve.py 8080
