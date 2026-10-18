#Requires -Version 5.1
<#
.SYNOPSIS
Build this repo's .mcpb bundle for Claude Desktop.

Implements the mandatory pipeline from MCPB_PACKAGING_STANDARDS.md section 2.5:
wipe + fresh-copy into mcpb/src (never edit the staged copy by hand), ensure
mcpb/.mcpbignore exists (the mcpb CLI reads .mcpbignore from the pack root),
run the required mechanical checks, then pack.

DEVIATION (documented, honest): the fleet-canonical script
(mcp-central-docs/scripts/fleet-mcpb-pack.ps1) assumes a repo-root
src/<pkg>/ + repo-root pyproject.toml layout. This repo keeps its Python
package under web_sota/vienna_life_assistant/ with pyproject in web_sota/.
So this script performs the SAME mandatory steps against that layout and
reuses the central fleet-mcpb-verify.py for checks. If the central script
ever gains -SrcDir support, this file should become the 5-line shim again.

mcpb/src is a build artifact -- regenerated every run, gitignored, never
committed. Also emits the release assets required by section 2.2b
(<name>.mcpb stable name + install.ps1) and rejects non-spec ${...} variables.
#>
$ErrorActionPreference = 'Stop'

$RepoRoot = Split-Path -Parent $PSScriptRoot
$McpbDir = Join-Path $RepoRoot 'mcpb'
$ManifestPath = Join-Path $McpbDir 'manifest.json'
$SrcPkg = Join-Path $RepoRoot 'web_sota\vienna_life_assistant'
$Pkg = 'vienna_life_assistant'
$ProjectDir = Join-Path $RepoRoot 'web_sota'
$VerifyScript = 'D:\Dev\repos\mcp-central-docs\scripts\fleet-mcpb-verify.py'
$Central = 'D:\Dev\repos\mcp-central-docs\scripts\fleet-mcpb-pack.ps1'

function Step($n, $msg) { Write-Host "== $n. $msg ==" -ForegroundColor Cyan }

if (-not (Test-Path $ManifestPath)) { throw "No mcpb/manifest.json -- cannot pack." }
$manifest = Get-Content $ManifestPath -Raw | ConvertFrom-Json
if ([string]::IsNullOrWhiteSpace($manifest.name)) { throw 'manifest.json has no name.' }
if ([string]::IsNullOrWhiteSpace($manifest.version)) { throw 'manifest.json has no version.' }
if (-not $manifest.server) { throw 'manifest.json has no server section.' }

$allowedVars = '^(__dirname|HOME|DESKTOP|DOCUMENTS|DOWNLOADS|pathSeparator|/|user_config\.[A-Za-z0-9_]+)$'
$badVars = [regex]::Matches((Get-Content $ManifestPath -Raw), '\$\{([^}]*)\}') |
    ForEach-Object { $_.Groups[1].Value } | Where-Object { $_ -notmatch $allowedVars } | Select-Object -Unique
if ($badVars) { throw "manifest.json uses variables Claude Desktop does not expand: $($badVars -join ', ')" }
if (-not (Test-Path $SrcPkg)) { throw "Copy source missing: $SrcPkg" }

if (-not (Get-Command bunx -ErrorAction SilentlyContinue)) {
    $bunxExe = Join-Path $env:USERPROFILE '.bun\bin\bunx.exe'
    if (Test-Path -LiteralPath $bunxExe) { $env:PATH = "$(Split-Path -Parent $bunxExe);$env:PATH" }
}
if (-not (Get-Command bunx -ErrorAction SilentlyContinue)) { throw 'bunx not found -- install Bun first.' }

$StageRoot = Join-Path $McpbDir 'src'
$StagePkg = Join-Path $StageRoot $Pkg

Step 0 '3-4-100 prompt gate (BLOCKING per ship checklist item 11)'
$sysPath = Join-Path $RepoRoot 'assets\prompts\system.md'
$userPath = Join-Path $RepoRoot 'assets\prompts\user.md'
$exPath = Join-Path $RepoRoot 'assets\prompts\examples.json'
$sysWords = ((Get-Content -Raw $sysPath) -split '\s+' | Where-Object { $_ }).Count
$userWords = ((Get-Content -Raw $userPath) -split '\s+' | Where-Object { $_ }).Count
$exCount = (Get-Content -Raw $exPath | ConvertFrom-Json).Count
Write-Host "  system=$sysWords user=$userWords examples=$exCount"
if ($sysWords -lt 3000 -or $userWords -lt 4000 -or $exCount -lt 100) {
    throw "3-4-100 FAIL: need 3000/4000/100, have $sysWords/$userWords/$exCount"
}

Step 1 'Wipe + fresh-copy web_sota/vienna_life_assistant -> mcpb/src (package dir preserved)'
if (Test-Path $StageRoot) { Remove-Item -Recurse -Force $StageRoot }
New-Item -ItemType Directory -Force -Path $StageRoot | Out-Null
Copy-Item -Recurse -Force $SrcPkg $StagePkg
Write-Host "  copied $SrcPkg -> $StagePkg"

$entryRelToSrc = 'vienna_life_assistant/stdio.py'
$entryFile = Join-Path $StageRoot $entryRelToSrc
if (-not (Test-Path $entryFile)) { throw "Staged entry point missing: $entryFile" }
$entryModule = 'vienna_life_assistant.stdio'

Step 1b 'Sync assets/prompts + icon + README + CHANGELOG into mcpb/'
$StagePrompts = Join-Path $McpbDir 'assets\prompts'
New-Item -ItemType Directory -Force -Path $StagePrompts | Out-Null
Copy-Item (Join-Path $RepoRoot 'assets\prompts\system.md') $StagePrompts -Force
Copy-Item (Join-Path $RepoRoot 'assets\prompts\user.md') $StagePrompts -Force
Copy-Item (Join-Path $RepoRoot 'assets\prompts\examples.json') $StagePrompts -Force
Copy-Item (Join-Path $RepoRoot 'assets\icon.png') (Join-Path $McpbDir 'assets') -Force
foreach ($f in @('README.md', 'CHANGELOG.md')) {
    if (Test-Path (Join-Path $RepoRoot $f)) { Copy-Item (Join-Path $RepoRoot $f) $McpbDir -Force }
}

Step 2 'Strip pollution from the fresh stage'
Get-ChildItem -Recurse -Path $StageRoot -Include '__pycache__' -Directory -ErrorAction SilentlyContinue |
    Remove-Item -Recurse -Force -ErrorAction SilentlyContinue
Get-ChildItem -Recurse -Path $StageRoot -Include '*.pyc', '*.bak', '*.bak.*', '*.orig', '*.rej' -File -ErrorAction SilentlyContinue |
    Remove-Item -Force -ErrorAction SilentlyContinue

Step 3 'Sync mcpb/.mcpbignore from repo root'
$McpbIgnore = Join-Path $McpbDir '.mcpbignore'
$RootIgnore = Join-Path $RepoRoot '.mcpbignore'
if (Test-Path $RootIgnore) { Copy-Item $RootIgnore $McpbIgnore -Force }
elseif (-not (Test-Path $McpbIgnore)) { throw 'No .mcpbignore anywhere -- cannot pack safely.' }

Step 4 'Required check: import isolation (only mcpb/src on sys.path)'
$env:PYTHONDONTWRITEBYTECODE = '1'
uv run --project $ProjectDir python $VerifyScript import $StageRoot $entryModule $Pkg
if ($LASTEXITCODE -ne 0) { throw 'Import-isolation check failed' }

Step 5 'Required check: AST call-site binding'
uv run --project $ProjectDir python $VerifyScript ast $entryFile
if ($LASTEXITCODE -ne 0) { throw 'AST check failed' }
Remove-Item Env:\PYTHONDONTWRITEBYTECODE -ErrorAction SilentlyContinue

Step 6 'Required check: pollution, AFTER import'
uv run --project $ProjectDir python $VerifyScript pollution $McpbDir
if ($LASTEXITCODE -ne 0) { throw 'Pollution check failed' }

Step 8 'mcpb pack'
$OutDir = Join-Path $RepoRoot 'dist'
New-Item -ItemType Directory -Force -Path $OutDir | Out-Null
$OutFile = Join-Path $OutDir "$($manifest.name)-v$($manifest.version).mcpb"
if (Test-Path $OutFile) { Remove-Item -Force $OutFile }
bunx @anthropic-ai/mcpb pack $McpbDir $OutFile
if ($LASTEXITCODE -ne 0) { throw 'mcpb pack failed' }

Step 8b 'Release assets: stable name + install.ps1'
$StableFile = Join-Path $OutDir "$($manifest.name).mcpb"
Copy-Item $OutFile $StableFile -Force
$InstallerSrc = 'D:\Dev\repos\mcp-central-docs\scripts\install-mcpb.ps1'
if (-not (Test-Path $InstallerSrc)) { throw "Fleet installer not found: $InstallerSrc" }
$remote = (git -C $RepoRoot remote get-url origin) -replace '\.git$', ''
if ($remote -notmatch 'github\.com[:/]([^/]+/[^/]+)$') { throw "origin is not a GitHub remote: $remote" }
$ghRepo = $Matches[1]
$sha256 = [System.Security.Cryptography.SHA256]::Create()
$hashBytes = $sha256.ComputeHash([System.IO.File]::ReadAllBytes($StableFile))
$sha256.Dispose()
$bundleSha = ([System.BitConverter]::ToString($hashBytes) -replace '-', '').ToLower()
$installer = Get-Content $InstallerSrc -Raw
$paramBlock = [regex]::Match($installer, '(?s)\[CmdletBinding\(\)\]\s*param\(.*?\r?\n\)\r?\n')
if (-not $paramBlock.Success) { throw 'install-mcpb.ps1 param block not found.' }
$header = "`$Source = 'https://github.com/$ghRepo/releases/latest/download/$($manifest.name).mcpb'`r`n`$Sha256 = '$bundleSha'`r`n"
[IO.File]::WriteAllText((Join-Path $OutDir 'install.ps1'), $installer.Replace($paramBlock.Value, $header), (New-Object System.Text.UTF8Encoding($false)))
Write-Host "  $StableFile + install.ps1 for $ghRepo (sha256 $bundleSha)"

Step 9 'Verify pack output'
if (-not (Test-Path $OutFile)) { throw "Pack did not produce $OutFile" }
Write-Host "  built: $OutFile ($([math]::Round((Get-Item $OutFile).Length / 1kb, 1)) KB)"
bunx @anthropic-ai/mcpb info $OutFile
if ($LASTEXITCODE -ne 0) { throw 'mcpb info failed' }

Step 10 'Required check: launch stdio entry from clean unpack, prove it serves JSON-RPC'
$LaunchDir = Join-Path ([IO.Path]::GetTempPath()) "mcpb-verify-$([Guid]::NewGuid().ToString('N').Substring(0,8))"
New-Item -ItemType Directory -Force -Path $LaunchDir | Out-Null
$proc = $null
try {
    # Expand the bundle with 7z/tar fallback: .mcpb is a zip. Expand-Archive handles it.
    Expand-Archive -Path $OutFile -DestinationPath $LaunchDir -Force
    $VenvPython = Join-Path $ProjectDir '.venv\Scripts\python.exe'
    if (-not (Test-Path $VenvPython)) { throw "No venv python at $VenvPython -- run 'uv sync' in web_sota first." }
    $prevPyPath = $env:PYTHONPATH
    $env:PYTHONPATH = Join-Path $LaunchDir 'src'
    $env:PYTHONDONTWRITEBYTECODE = '1'
    $init = '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"pack-check","version":"0"}}}' + "`n"
    $outLog = Join-Path $LaunchDir 'launch.out.log'
    $errLog = Join-Path $LaunchDir 'launch.err.log'
    $psi = New-Object System.Diagnostics.ProcessStartInfo
    $psi.FileName = $VenvPython
    $psi.Arguments = '-m vienna_life_assistant.stdio'
    $psi.WorkingDirectory = $LaunchDir
    $psi.RedirectStandardInput = $true
    $psi.RedirectStandardOutput = $true
    $psi.RedirectStandardError = $true
    $psi.UseShellExecute = $false
    $psi.CreateNoWindow = $true
    $proc = [System.Diagnostics.Process]::Start($psi)
    $proc.StandardInput.WriteLine($init)
    $proc.StandardInput.WriteLine('{"jsonrpc":"2.0","method":"notifications/initialized"}')
    $proc.StandardInput.Close()
    # stdin EOF ends the stdio loop; the server must have answered before exiting.
    if (-not $proc.WaitForExit(25000)) { throw 'stdio server did not exit within 25s of stdin EOF' }
    $out = $proc.StandardOutput.ReadToEnd()
    $err = $proc.StandardError.ReadToEnd()
    if ($out -notmatch '"serverInfo"') { throw "stdio server did not return serverInfo.`nSTDOUT: $out`nSTDERR: $err" }
    if ($err -match 'Traceback \(most recent call last\)') { throw "stdio server logged a traceback.`n$err" }
    Write-Host '  OK: stdio entry answered initialize with serverInfo (actually serves)'
} finally {
    if ($proc -and -not $proc.HasExited) { Stop-Process -Id $proc.Id -Force -ErrorAction SilentlyContinue }
    if ($null -eq $prevPyPath) { Remove-Item Env:\PYTHONPATH -ErrorAction SilentlyContinue } else { $env:PYTHONPATH = $prevPyPath }
    Remove-Item Env:\PYTHONDONTWRITEBYTECODE -ErrorAction SilentlyContinue
    Remove-Item -Recurse -Force $LaunchDir -ErrorAction SilentlyContinue
}

Step 11 'Clean up staging copy'
Remove-Item -Recurse -Force $StageRoot

Write-Host "Done: $OutFile" -ForegroundColor Green
