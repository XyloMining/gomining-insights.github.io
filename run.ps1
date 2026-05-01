# GoMining Crypto Insights - Development Server PowerShell Script
# This script starts the development server for the GoMining Crypto Insights project

Write-Host ""
Write-Host "========================================"
Write-Host "  GoMining Crypto Insights"
Write-Host "  Development Server"
Write-Host "========================================"
Write-Host ""

# Check if pnpm is installed
try {
    $pnpmVersion = pnpm --version 2>$null
    Write-Host "[INFO] pnpm version: $pnpmVersion"
} catch {
    Write-Host "[ERROR] pnpm is not installed or not in PATH"
    Write-Host "Please install pnpm first: npm install -g pnpm"
    Write-Host ""
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if node_modules exists
if (-not (Test-Path "node_modules")) {
    Write-Host "[INFO] Installing dependencies..."
    & pnpm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install dependencies"
        Read-Host "Press Enter to exit"
        exit 1
    }
}

Write-Host "[INFO] Starting development server..."
Write-Host "[INFO] The application will be available at http://localhost:3000"
Write-Host "[INFO] Press Ctrl+C to stop the server"
Write-Host ""

# Start the development server
& pnpm dev

Read-Host "Press Enter to exit"
