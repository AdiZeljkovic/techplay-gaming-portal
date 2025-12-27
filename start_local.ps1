$currentDir = Get-Location

# 1. Start Laravel Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$currentDir'; php artisan serve"

# 2. Start Reverb Server (WebSockets)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$currentDir'; php artisan reverb:start"

# 3. Start Queue Worker
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$currentDir'; php artisan queue:listen --tries=3"

# 4. Start Frontend (Vite)
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$currentDir/frontend'; npm run dev"

Write-Host "All servers started in separate windows!"
