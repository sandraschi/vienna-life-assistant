set windows-shell := ["powershell.exe", "-NoProfile", "-Command"]
import 'scripts/just/fleet.just'

# Open the interactive recipe dashboard
default:
    @just --list

# Serve the backend
serve:
    Set-Location '{{justfile_directory()}}\web_sota'
    uv run python -m vienna_life_assistant.server

# Serve the frontend
serve-frontend:
    Set-Location '{{justfile_directory()}}\web_sota'
    npm run dev

# Start full stack
up:
    Set-Location '{{justfile_directory()}}\web_sota'
    .\start.ps1

# Run linting
lint:
    Set-Location '{{justfile_directory()}}\web_sota'
    uv run ruff check .

# Run fix and formatting
fix:
    Set-Location '{{justfile_directory()}}\web_sota'
    uv run ruff check . --fix --unsafe-fixes
    uv run ruff format .

# Run tests
test:
    Set-Location '{{justfile_directory()}}\web_sota'
    uv run pytest . -v

# TypeScript typecheck
types:
    Set-Location '{{justfile_directory()}}\web_sota'
    npx tsc --noEmit

# Run E2E tests
e2e:
    Set-Location '{{justfile_directory()}}\web_sota'
    npx playwright test

# Run all gates
gates-green: lint types
    Set-Location '{{justfile_directory()}}\web_sota'
    uv run pytest . -q

# Build Tauri/NSIS installer
build-native:
    Set-Location '{{justfile_directory()}}\native'
    .\build.ps1

# Security audit
check-sec:
    Set-Location '{{justfile_directory()}}\web_sota'
    uv run bandit -r vienna_life_assistant/

# Audit dependencies
audit-deps:
    Set-Location '{{justfile_directory()}}\web_sota'
    uv run safety check

# Bootstrap: install dev deps + pre-commit hook
bootstrap:
    uv sync --group dev
    uv run pre-commit install
    Write-Host "Pre-commit hooks installed." -ForegroundColor Green