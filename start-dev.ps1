# Vienna Life Assistant - Development Startup Script
# PowerShell script to start all development services

Write-Host "🚀 Starting Vienna Life Assistant..." -ForegroundColor Cyan

# Check if Docker is running
$dockerRunning = docker info 2>&1 | Select-String "Server"
if (-not $dockerRunning) {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

Write-Host "`n📦 Starting PostgreSQL and Redis..." -ForegroundColor Yellow
docker compose up -d postgres redis

# Wait for services to be healthy
Write-Host "⏳ Waiting for services to be healthy..." -ForegroundColor Yellow
$maxWait = 30
$waited = 0
while ($waited -lt $maxWait) {
    $status = docker compose ps --format json | ConvertFrom-Json
    $healthy = $true
    foreach ($service in $status) {
        if ($service.Health -ne "healthy" -and $service.State -ne "running") {
            $healthy = $false
            break
        }
    }
    if ($healthy) {
        break
    }
    Start-Sleep -Seconds 2
    $waited += 2
}

if ($waited -ge $maxWait) {
    Write-Host "⚠️  Services may not be fully ready. Continuing anyway..." -ForegroundColor Yellow
} else {
    Write-Host "✅ Database services are ready!" -ForegroundColor Green
}

Write-Host "`n📝 Next steps:" -ForegroundColor Cyan
Write-Host "  1. Open a new terminal and run:" -ForegroundColor White
Write-Host "     cd D:\Dev\repos\vienna-life-assistant\backend" -ForegroundColor Gray
Write-Host "     .\venv\Scripts\Activate.ps1" -ForegroundColor Gray
Write-Host "     uvicorn api.main:app --reload --host 0.0.0.0 --port 9001" -ForegroundColor Gray
Write-Host ""
Write-Host "  2. Open another terminal and run:" -ForegroundColor White
Write-Host "     cd D:\Dev\repos\vienna-life-assistant\frontend" -ForegroundColor Gray
Write-Host "     pnpm dev" -ForegroundColor Gray
Write-Host ""
Write-Host "  3. Open browser:" -ForegroundColor White
Write-Host "     Frontend: http://localhost:9173" -ForegroundColor Gray
Write-Host "     Backend API: http://localhost:9001/docs" -ForegroundColor Gray
Write-Host ""
Write-Host "✨ Happy coding!" -ForegroundColor Cyan

