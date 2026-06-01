@echo off
title Cancionero del Beni - Servidor Dev
echo.
echo  ====================================
echo   Cancionero del Beni - Iniciando...
echo  ====================================
echo.

SET PATH=C:\Program Files\nodejs;%PATH%

echo  Iniciando servidor en http://localhost:3000
echo  Presiona Ctrl+C para detener el servidor
echo.

node .\node_modules\next\dist\bin\next dev --port 3000

pause
