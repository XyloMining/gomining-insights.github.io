@echo off
SETLOCAL EnableDelayedExpansion
REM GoMining Crypto Insights - Development Server Batch File

echo.
echo ========================================
echo  GoMining Crypto Insights
echo  Development Server
echo ========================================
echo.

REM Check if pnpm is installed
where pnpm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] pnpm is not installed or not in PATH
    echo Please install pnpm first: npm install -g pnpm
    echo.
    pause
    exit /b 1
)

REM Check if node_modules exists or if cross-env is missing
if not exist "node_modules" (
    echo [INFO] node_modules not found. Installing dependencies...
    call pnpm install
) else (
    REM Check if cross-env is actually available in node_modules
    if not exist "node_modules\.bin\cross-env.cmd" (
        echo [INFO] cross-env not found. Updating dependencies...
        call pnpm install
    )
)

echo [INFO] Starting development server...
echo [INFO] The application will be available at http://localhost:3000
echo [INFO] Press Ctrl+C to stop the server
echo.

REM Try running with pnpm dev (which uses cross-env)
REM If cross-env still fails, we use a Windows-native fallback
call pnpm dev
if %errorlevel% neq 0 (
    echo.
    echo [WARN] Standard 'pnpm dev' failed. Trying Windows-native fallback...
    echo.
    SET NODE_ENV=development
    call npx tsx watch server/_core/index.ts
)

pause
