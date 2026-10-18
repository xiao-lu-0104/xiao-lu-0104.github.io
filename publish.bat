@echo off
chcp 65001 >nul
cd /d "%~dp0"

echo.
echo   发布更新到 GitHub Pages
echo   ------------------------------------
echo.

git add -A

set "msg="
set /p "msg=更新说明（直接回车用默认）: "
if "%msg%"=="" set "msg=更新内容"

git commit -m "%msg%"
if errorlevel 1 (
  echo.
  echo   没有需要发布的改动。
  pause
  exit /b 0
)

git push
if errorlevel 1 (
  echo.
  echo   直连 GitHub 失败，尝试通过本地代理重试...
  git -c http.proxy=http://127.0.0.1:7897 -c https.proxy=http://127.0.0.1:7897 push
  if errorlevel 1 (
    echo.
    echo   推送仍然失败，请检查网络或代理是否可用。
    pause
    exit /b 1
  )
)

echo.
echo   已推送。GitHub 会在 1~2 分钟内自动构建并上线：
echo   https://xiao-lu-0104.github.io/
echo.
pause
