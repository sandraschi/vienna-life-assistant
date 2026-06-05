Param([switch]$Headless)

if ($Headless -and ($Host.UI.RawUI.WindowTitle -notmatch 'Hidden')) {
    Start-Process pwsh -ArgumentList '-NoProfile', '-File', $PSCommandPath, '-Headless' -WindowStyle Hidden
    exit
}

$WebPort = 10988
$BackendPort = 10922
$ProjectRoot = Split-Path -Parent $PSScriptRoot

Write-Host "Starting ViLife (vienna-life-assistant)..." -ForegroundColor Cyan
Write-Host "Frontend $WebPort | Backend $BackendPort | MCP /mcp" -ForegroundColor Gray

$pids = Get-NetTCPConnection -LocalPort $WebPort, $BackendPort -ErrorAction SilentlyContinue |
    Where-Object { $_.OwningProcess -gt 4 } |
    Select-Object -ExpandProperty OwningProcess -Unique
foreach ($p in $pids) {
    Write-Host "Releasing port squatter PID $p" -ForegroundColor Yellow
    try { Stop-Process -Id $p -Force -ErrorAction Stop } catch { }
}

Set-Location $PSScriptRoot
if (-not (Test-Path "node_modules")) { npm install }

$backendCmd = @"
`$env:PYTHONPATH = '$PSScriptRoot;$ProjectRoot\backend'
Set-Location '$PSScriptRoot'
uv run uvicorn vienna_life_assistant.server:app --host 127.0.0.1 --port $BackendPort --log-level info
"@

Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd -WindowStyle Normal

$healthUrl = "http://127.0.0.1:$BackendPort/health"
$ready = $false
for ($i = 0; $i -lt 90; $i++) {
    try {
        $null = Invoke-WebRequest -Uri $healthUrl -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
        $ready = $true
        Write-Host "Backend ready on $BackendPort" -ForegroundColor Green
        break
    } catch {
        Start-Sleep -Seconds 1
    }
}
if (-not $ready) {
    Write-Host "Backend failed to bind on $BackendPort within 90s" -ForegroundColor Red
    exit 1
}

if ($Headless) { exit 0 }

$frontendUrl = "http://127.0.0.1:$WebPort/"
$pollAndOpen = @"
for (`$i = 0; `$i -lt 60; `$i++) {
    try {
        `$null = Invoke-WebRequest -Uri '$frontendUrl' -TimeoutSec 2 -UseBasicParsing -ErrorAction Stop
        Start-Process '$frontendUrl'
        exit
    } catch { Start-Sleep -Seconds 1 }
}
"@
Start-Process powershell -ArgumentList "-NoProfile", "-WindowStyle", "Hidden", "-Command", $pollAndOpen

Write-Host "Starting Vite on $WebPort ..." -ForegroundColor Green
npm run dev -- --port $WebPort --host 127.0.0.1
