@echo off
SETLOCAL EnableDelayedExpansion

:: GoMining Crypto Insights - AI Test Post Trigger
:: This script manually triggers the AI generation logic to create a test blog post.

echo =====================================================
echo    GoMining AI Blog Post Generator - Test Trigger
echo =====================================================
echo.

:: Check if .env exists
if not exist ".env" (
    echo [ERROR] .env file not found! 
    echo Please ensure you have a .env file with your OPENAI_API_KEY.
    pause
    exit /b 1
)

echo [INFO] Starting AI generation process...
echo [INFO] This may take up to 60 seconds depending on AI response time.
echo.

:: Run the test script using pnpm and tsx
:: We use 'call' to ensure the batch script continues after pnpm finishes
call pnpm dlx tsx scripts/test-ai-generation.ts

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [ERROR] The test post generation failed.
    echo [TIP] Check your OpenAI API key and credit balance.
    echo.
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo =====================================================
echo    SUCCESS: Test post generated and published!
echo =====================================================
echo.
pause
