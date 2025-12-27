# deploy.ps1 - Automated Deployment Script for TechPlay.gg
# Usage: .\deployment\deploy.ps1

$ServerIP = "46.224.110.57"
$RemotePath = "/var/www/techplay"
$DeploymentDir = "deployment"
$LocalDBPassword = "postgres" # <--- CHANGE THIS IF YOUR LOCAL DB PASSWORD IS DIFFERENT

Write-Host "[*] Starting Deployment Automation..." -ForegroundColor Cyan

# 1. Archive Media (Images need to be uploaded manually as they are not in git usually)
Write-Host "[+] Archiving Media (User Uploads)..." -ForegroundColor Yellow
if (Test-Path "$DeploymentDir\media.zip") { Remove-Item "$DeploymentDir\media.zip" }
if (Test-Path "storage\app\public") {
    Get-ChildItem -Path "storage\app\public\*" | Compress-Archive -DestinationPath "$DeploymentDir\media.zip" -Force
}
else {
    Write-Warning "No media directory found. Skipping media.zip."
}

# 2. Export Database
Write-Host "[+] Attempting to Export Local Database..." -ForegroundColor Yellow
if (Test-Path "$DeploymentDir\media.zip") { Remove-Item "$DeploymentDir\media.zip" }
if (Test-Path "storage\app\public") {
    Get-ChildItem -Path "storage\app\public\*" | Compress-Archive -DestinationPath "$DeploymentDir\media.zip" -Force
}
else {
    Write-Warning "No media directory found. Skipping media.zip."
}

# 4. Export Database (Optional - Best Effort)
Write-Host "[+] Attempting to Export Local Database..." -ForegroundColor Yellow
$DumpPath = "$DeploymentDir\database.sql"

# Try to find pg_dump
$PgDumpPath = "pg_dump" # Default to PATH
if (-not (Get-Command "pg_dump" -ErrorAction SilentlyContinue)) {
    if (Test-Path "C:\Program Files\PostgreSQL\18\bin\pg_dump.exe") {
        $PgDumpPath = "C:\Program Files\PostgreSQL\18\bin\pg_dump.exe"
    }
    elseif (Test-Path "C:\Program Files\PostgreSQL\13\bin\pg_dump.exe") {
        $PgDumpPath = "C:\Program Files\PostgreSQL\13\bin\pg_dump.exe"
    }
}

try {
    Write-Host "    Using pg_dump: $PgDumpPath" -ForegroundColor Gray
    $Env:PGPASSWORD = $LocalDBPassword 
    
    # Run absolute path with call operator '&'
    & $PgDumpPath -h 127.0.0.1 -U postgres techplay -f $DumpPath
    
    if (Test-Path $DumpPath) {
        if ((Get-Item $DumpPath).Length -gt 0) {
            Write-Host "[OK] Database dumped to $DumpPath" -ForegroundColor Green
        }
        else {
            Write-Warning "Database dump created but is empty. Check credentials."
        }
    }
    else {
        Write-Warning "pg_dump ran but file not found."
    }
}
catch {
    Write-Warning "Database export failed. Error: $_"
}

# 5. Upload Config & Assets (Git Mode)
Write-Host "[^] Uploading Configuration & Assets..." -ForegroundColor Cyan

# Ensure remote dir exists
ssh root@$ServerIP "mkdir -p $RemotePath"

# Helper function to upload
function Upload-File($Path) {
    Write-Host "    Uploading $Path..." -NoNewline
    scp $Path root@$ServerIP`:$RemotePath/
    if ($?) { Write-Host " [OK]" -ForegroundColor Green } else { Write-Host " [FAILED]" -ForegroundColor Red; exit }
}

Upload-File "$DeploymentDir\setup.sh"
Upload-File "$DeploymentDir\install-git.sh"
Upload-File "$DeploymentDir\env.backend"
Upload-File "$DeploymentDir\env.frontend"
Upload-File "$DeploymentDir\nginx\techplay.conf"

if (Test-Path "$DeploymentDir\database.sql") {
    Upload-File "$DeploymentDir\database.sql"
}

# Only upload media if it exists (Code goes via Git)
if (Test-Path "$DeploymentDir\media.zip") {
    Write-Host "    Uploading Media (Images)..."
    Upload-File "$DeploymentDir\media.zip"
}

Write-Host "[OK] Configuration Uploaded!" -ForegroundColor Green
Write-Host "-> Next Steps:" -ForegroundColor White
Write-Host "1. Push your code to GitHub."
Write-Host "2. SSH into server: ssh root@$ServerIP"
Write-Host "3. Run: ./install-git.sh https://github.com/YOUR_USER/YOUR_REPO.git" -ForegroundColor Yellow

Write-Host "[OK] Upload Complete!" -ForegroundColor Green
Write-Host "-> Now SSH into the server and run: ./install.sh" -ForegroundColor White
