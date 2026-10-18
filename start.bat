@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo   个人网站启动中，请稍候...
echo.
echo   站点:     http://localhost:5173
echo   管理台:   http://127.0.0.1:4317
echo.
echo   关闭这个窗口（或按 Ctrl+C）即停止网站。
echo.

rem 等 VitePress 起来后再打开浏览器
start "" cmd /c "timeout /t 4 >nul & start http://localhost:5173"

call npm run dev
pause
