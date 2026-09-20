@echo off
setlocal

set ROOT=%~dp0

echo Starting DynamoDB Local...
start "DynamoDB Local - :8000" cmd /k "cd /d "%ROOT%server" && java -Djava.library.path=./dynamodb-local/DynamoDBLocal_lib -jar ./dynamodb-local/DynamoDBLocal.jar -sharedDb -dbPath . -port 8000"

timeout /t 5 /nobreak >nul

echo Starting Server (API)...
start "Server API - :8001" cmd /k "cd /d "%ROOT%server" && npm run dev"

echo Starting Client...
start "Client - :3000" cmd /k "cd /d "%ROOT%client" && npm run dev"

echo Starting Admin...
start "Admin - :3001" cmd /k "cd /d "%ROOT%admin" && npm run dev -- -p 3001"

echo.
echo All services are starting in separate windows:
echo   DynamoDB Local : http://localhost:8000
echo   Server (API)   : http://localhost:8001
echo   Client         : http://localhost:3000
echo   Admin          : http://localhost:3001
echo.
echo Close a window to stop that service. Closing this window will NOT stop them.
endlocal
