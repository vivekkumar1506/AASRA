@echo off
echo Starting Aasra Localhost Server on port 5500...
start http://localhost:5500
python -m http.server 5500 --bind 127.0.0.1
pause
