# vienna-life-assistant starter
param([switch]$BackendOnly)
$ErrorActionPreference = "Stop"
$Repo = $PSScriptRoot
$UV = "C:\Users\sandr\.local\bin\uv.exe"
Write-Host "=== vienna-life-assistant ===" -ForegroundColor Cyan
& $UV run python -m vienna_life_assistant
