param(
    [switch]$Headless,
    [switch]$BackendOnly,
    [switch]$FrontendOnly,
    [switch]$NoBrowser,
    [switch]$ReuseIfRunning)

$ProjectRoot = Split-Path -Parent $PSScriptRoot
$FleetStartPath = Join-Path $ProjectRoot "scripts\FleetStartMode.ps1"
if (-not (Test-Path -LiteralPath $FleetStartPath)) {
    Write-Host "ERROR: Missing vendored launcher helper: $FleetStartPath" -ForegroundColor Red
    exit 1
}
. $FleetStartPath
$FleetStart = Initialize-FleetStartMode @PSBoundParameters
Enter-FleetHeadlessConsole -Headless:$Headless -BackendOnly:$BackendOnly

$portResolve = @{
    Ports      = @($WebPort, $BackendPort, 10989, 10990)
    Label      = "vienna-life-assistant"
    AllowReuse = $ReuseIfRunning
}
if ($ReuseIfRunning) {
    $portResolve.HealthChecks = @{
        $WebPort = "http://127.0.0.1:$WebPort/"
        $BackendPort = "http://127.0.0.1:$BackendPort/health"
    }
}
$portState = Resolve-FleetPortConflict @portResolve
if ($portState.Action -eq 'Blocked') { exit 1 }
if ($portState.Reuse) { return }
$WebPort = 10988
$BackendPort = 10922

Write-Host "Starting ViLife (vienna-life-assistant)..." -ForegroundColor Cyan
Write-Host "Frontend $WebPort | Backend $BackendPort | MCP /mcp" -ForegroundColor Gray


Set-Location $PSScriptRoot
if (-not (Test-Path "node_modules")) { npm install }

if ($FleetStart.RunBackend) {
    $backendCmd = @"
`$env:PYTHONPATH = '$PSScriptRoot;$ProjectRoot\backend'
Set-Location '$PSScriptRoot'
uv run uvicorn vienna_life_assistant.server:app --host 127.0.0.1 --port $BackendPort --log-level info
"@
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $backendCmd -WorkingDirectory $PSScriptRoot -WindowStyle Normal

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
}

if (-not $FleetStart.RunFrontend) { return }

$frontendUrl = "http://127.0.0.1:$WebPort/"
if (-not $FleetStart.SkipBrowser) {
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
}

Write-Host "Starting Vite on $WebPort ..." -ForegroundColor Green
npm run dev -- --port $WebPort --host 127.0.0.1 --strictPort

