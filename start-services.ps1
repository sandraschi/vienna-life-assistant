# Start Vienna Life Assistant Services
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "Starting Vienna Life Assistant services..." -ForegroundColor Cyan
Write-Host "Working directory: $scriptPath" -ForegroundColor Gray

# Start backend
Write-Host "`nStarting backend on port 9001..." -ForegroundColor Yellow
$backendPath = Join-Path $scriptPath "backend"
$venvPath = Join-Path $backendPath "venv\Scripts\Activate.ps1"

# Build backend command - activate venv if it exists, otherwise use python -m uvicorn
if (Test-Path $venvPath) {
    Write-Host "  Found virtual environment, activating..." -ForegroundColor Gray
    $backendCommand = "Set-Location '$backendPath'; `$env:PYTHONPATH='$backendPath'; & '$venvPath'; uvicorn api.main:app --reload --host 0.0.0.0 --port 9001"
} else {
    Write-Host "  No virtual environment found, using system Python..." -ForegroundColor Gray
    # Ensure backend directory is in Python path
    $backendCommand = "Set-Location '$backendPath'; `$env:PYTHONPATH='$backendPath'; `$env:PYTHONUNBUFFERED='1'; python -m uvicorn api.main:app --reload --host 0.0.0.0 --port 9001"
}
Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCommand

# Wait a moment
Start-Sleep -Seconds 3

# Start frontend
Write-Host "Starting frontend on port 5173..." -ForegroundColor Yellow
$frontendPath = Join-Path $scriptPath "frontend"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$frontendPath'; pnpm dev"

Write-Host "`nServices starting in separate windows:" -ForegroundColor Green
Write-Host "  Backend API: http://localhost:9001" -ForegroundColor White
Write-Host "  Backend Docs: http://localhost:9001/docs" -ForegroundColor White
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "`nPress any key to exit this script (services will continue running)..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
