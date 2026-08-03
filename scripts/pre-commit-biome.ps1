# Pre-commit Biome hook — runs tsc + biome in web_sota on staged web files.
# Falls back gracefully when node_modules is missing (CI/first clone).
param()
$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent $PSScriptRoot
$WebRoot = Join-Path $Root "web_sota"

if (-not (Test-Path (Join-Path $WebRoot "node_modules"))) {
    Write-Host "  [biome-hook] node_modules missing — skipping frontend check" -ForegroundColor DarkYellow
    exit 0
}

Push-Location $WebRoot
try {
    Write-Host "  [biome-hook] tsc --noEmit..." -ForegroundColor Gray
    npx tsc --noEmit
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    Write-Host "  [biome-hook] biome check --write src..." -ForegroundColor Gray
    npx biome check --write src
    if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
    Write-Host "  [biome-hook] frontend checks PASSED" -ForegroundColor Green
} finally {
    Pop-Location
}
