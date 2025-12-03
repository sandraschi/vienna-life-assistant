# Vienna Life Assistant - MCP Integration Setup Script
# FEATUREPLOSION Edition - Complete setup for MCP server + client

Write-Host "🚀 Vienna Life Assistant - MCP Integration Setup" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Docker Desktop is running
Write-Host "Checking Docker Desktop..." -ForegroundColor Yellow
$dockerRunning = $false
try {
    docker ps | Out-Null
    $dockerRunning = $true
    Write-Host "✅ Docker Desktop is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Desktop is NOT running" -ForegroundColor Red
    Write-Host "   Please start Docker Desktop and run this script again" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if .env exists
Write-Host ""
Write-Host "Checking environment configuration..." -ForegroundColor Yellow
if (-not (Test-Path "backend\.env")) {
    Write-Host "⚠️  backend\.env not found" -ForegroundColor Yellow
    Write-Host "   Creating from .env.example..." -ForegroundColor Yellow
    
    if (Test-Path "backend\.env.example") {
        Copy-Item "backend\.env.example" "backend\.env"
        Write-Host "✅ Created backend\.env" -ForegroundColor Green
        Write-Host "   Please edit backend\.env with your actual configuration" -ForegroundColor Cyan
    } else {
        Write-Host "❌ backend\.env.example not found" -ForegroundColor Red
        Write-Host "   Please create backend\.env manually" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ backend\.env exists" -ForegroundColor Green
}

# Check Python dependencies
Write-Host ""
Write-Host "Checking Python dependencies..." -ForegroundColor Yellow
$requirementsPath = "backend\requirements.txt"
if (Test-Path $requirementsPath) {
    $hasFastMCP = Select-String -Path $requirementsPath -Pattern "fastmcp" -Quiet
    if ($hasFastMCP) {
        Write-Host "✅ FastMCP dependency found in requirements.txt" -ForegroundColor Green
    } else {
        Write-Host "❌ FastMCP dependency missing" -ForegroundColor Red
        Write-Host "   This should not happen - check requirements.txt" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ requirements.txt not found" -ForegroundColor Red
}

# Rebuild Docker containers
Write-Host ""
Write-Host "Rebuilding Docker containers..." -ForegroundColor Yellow
Write-Host "This will take a few minutes..." -ForegroundColor Cyan
Write-Host ""

# Stop existing containers
Write-Host "Stopping existing containers..." -ForegroundColor Yellow
docker compose down 2>&1 | Out-Null

# Build containers (no cache for clean build)
Write-Host "Building containers (this includes FastMCP installation)..." -ForegroundColor Yellow
docker compose build --no-cache 2>&1 | ForEach-Object {
    if ($_ -match "Step \d+/\d+") {
        Write-Host $_ -ForegroundColor Cyan
    }
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Containers built successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Container build failed" -ForegroundColor Red
    Write-Host "   Check the error messages above" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Start containers
Write-Host ""
Write-Host "Starting containers..." -ForegroundColor Yellow
docker compose up -d

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Containers started successfully" -ForegroundColor Green
} else {
    Write-Host "❌ Container startup failed" -ForegroundColor Red
    Write-Host "   Check the error messages above" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Wait for services to be ready
Write-Host ""
Write-Host "Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check container status
Write-Host ""
Write-Host "Container Status:" -ForegroundColor Cyan
docker compose ps

# Test backend API
Write-Host ""
Write-Host "Testing backend API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:9001/health" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Backend API is responding" -ForegroundColor Green
        $json = $response.Content | ConvertFrom-Json
        Write-Host "   Service: $($json.service)" -ForegroundColor Cyan
        Write-Host "   Version: $($json.version)" -ForegroundColor Cyan
    }
} catch {
    Write-Host "⚠️  Backend API not responding yet" -ForegroundColor Yellow
    Write-Host "   This is normal - it may take a few more seconds to start" -ForegroundColor Cyan
}

# Test media status endpoint
Write-Host ""
Write-Host "Testing media integrations..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:9001/api/media/status" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Media API is responding" -ForegroundColor Green
        $json = $response.Content | ConvertFrom-Json
        
        Write-Host ""
        Write-Host "Integration Status:" -ForegroundColor Cyan
        Write-Host "  Plex:    $(if ($json.plex.connected) { '✅ Connected' } else { '❌ Not connected' })" -ForegroundColor $(if ($json.plex.connected) { 'Green' } else { 'Yellow' })
        Write-Host "  Calibre: $(if ($json.calibre.connected) { '✅ Connected' } else { '❌ Not connected' })" -ForegroundColor $(if ($json.calibre.connected) { 'Green' } else { 'Yellow' })
        Write-Host "  Immich:  $(if ($json.immich.connected) { '✅ Connected' } else { '❌ Not connected' })" -ForegroundColor $(if ($json.immich.connected) { 'Green' } else { 'Yellow' })
        Write-Host "  Tapo:    $(if ($json.tapo.connected) { '✅ Connected' } else { '❌ Not connected' })" -ForegroundColor $(if ($json.tapo.connected) { 'Green' } else { 'Yellow' })
        Write-Host "  Ollama:  $(if ($json.ollama.connected) { '✅ Connected' } else { '❌ Not connected' })" -ForegroundColor $(if ($json.ollama.connected) { 'Green' } else { 'Yellow' })
    }
} catch {
    Write-Host "⚠️  Media API not responding yet" -ForegroundColor Yellow
    Write-Host "   This is normal - it may take a few more seconds to start" -ForegroundColor Cyan
}

# Summary
Write-Host ""
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host "🎉 Setup Complete!" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Frontend: Start the frontend dev server" -ForegroundColor Yellow
Write-Host "   cd frontend" -ForegroundColor Gray
Write-Host "   pnpm install" -ForegroundColor Gray
Write-Host "   pnpm dev" -ForegroundColor Gray
Write-Host "   Visit: http://localhost:9173" -ForegroundColor Cyan
Write-Host ""
Write-Host "2. Configuration: Edit backend\.env with your service URLs" -ForegroundColor Yellow
Write-Host "   - PLEX_MCP_URL, PLEX_TOKEN" -ForegroundColor Gray
Write-Host "   - CALIBRE_MCP_URL" -ForegroundColor Gray
Write-Host "   - IMMICH_MCP_URL, IMMICH_API_KEY" -ForegroundColor Gray
Write-Host "   - TAPO_MCP_URL" -ForegroundColor Gray
Write-Host "   - OLLAMA_MCP_URL (if using Ollama)" -ForegroundColor Gray
Write-Host ""
Write-Host "3. MCP Servers: Ensure external MCP servers are running" -ForegroundColor Yellow
Write-Host "   - plex-mcp (D:\Dev\repos\plex-mcp)" -ForegroundColor Gray
Write-Host "   - calibre-mcp (D:\Dev\repos\calibre-mcp)" -ForegroundColor Gray
Write-Host "   - immich-mcp (D:\Dev\repos\immich-mcp)" -ForegroundColor Gray
Write-Host "   - tapo-camera-mcp (D:\Dev\repos\tapo-camera-mcp)" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Tailscale: Ensure Tailscale is running for Goliath access" -ForegroundColor Yellow
Write-Host "   tailscale status" -ForegroundColor Gray
Write-Host ""
Write-Host "5. Test: Go to Media & Home tab in the frontend" -ForegroundColor Yellow
Write-Host "   Should show connection status for all services" -ForegroundColor Gray
Write-Host ""
Write-Host "Documentation:" -ForegroundColor Cyan
Write-Host "  - MCP_INTEGRATION.md - Complete integration guide" -ForegroundColor Gray
Write-Host "  - ECOSYSTEM_INTEGRATION.md - Original integration plan" -ForegroundColor Gray
Write-Host ""
Write-Host "Useful Commands:" -ForegroundColor Cyan
Write-Host "  docker compose logs -f backend    # View backend logs" -ForegroundColor Gray
Write-Host "  docker compose ps                 # Check container status" -ForegroundColor Gray
Write-Host "  docker compose restart backend    # Restart backend" -ForegroundColor Gray
Write-Host "  docker compose down               # Stop all containers" -ForegroundColor Gray
Write-Host ""
Write-Host "🚀 FEATUREPLOSION COMPLETE! Your personal command center is ready!" -ForegroundColor Green
Write-Host ""

