# Vienna Life Assistant - Test Runner
# Run the complete test suite

param(
    [switch]$Coverage,
    [switch]$Verbose,
    [string]$TestPath = ""
)

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host "   🧪 Vienna Life Assistant Tests" -ForegroundColor White
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

# Navigate to backend
cd backend

# Activate virtual environment
Write-Host "🔧 Activating virtual environment..." -ForegroundColor Yellow
.\venv\Scripts\Activate.ps1

# Build pytest command
$pytestArgs = @()

if ($Verbose) {
    $pytestArgs += "-vv"
} else {
    $pytestArgs += "-v"
}

if ($Coverage) {
    $pytestArgs += "--cov=api"
    $pytestArgs += "--cov=models"
    $pytestArgs += "--cov=services"
    $pytestArgs += "--cov-report=html"
    $pytestArgs += "--cov-report=term"
}

if ($TestPath) {
    $pytestArgs += $TestPath
}

# Run tests
Write-Host "🧪 Running tests..." -ForegroundColor Cyan
Write-Host ""

pytest @pytestArgs

$exitCode = $LASTEXITCODE

Write-Host ""
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan

if ($exitCode -eq 0) {
    Write-Host "   ✅ All tests passed!" -ForegroundColor Green
} else {
    Write-Host "   ❌ Some tests failed" -ForegroundColor Red
}

Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor Cyan
Write-Host ""

if ($Coverage) {
    Write-Host "📊 Coverage report: backend\htmlcov\index.html" -ForegroundColor Yellow
}

exit $exitCode

