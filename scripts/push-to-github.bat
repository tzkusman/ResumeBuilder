@echo off
REM ============================================================
REM  ResumeBuild -> GitHub  (Windows)
REM  1. Download the project ZIP from the workspace, unzip it.
REM  2. Put this file in the unzipped folder (next to package.json).
REM  3. Double-click it. Requires git installed (git-scm.com).
REM ============================================================
cd /d "%~dp0.."

git init -b main
git add .
git commit -m "ResumeBuild v1.0.0 - ATS resume builder with SEO pages"
git remote remove origin 2>nul
git remote add origin https://github.com/tzkusman/Resumebuild.git
git branch -M main
git push -u origin main

echo.
echo ============================================================
echo  Done! Code is on GitHub.
echo  Next: create the desktop release -
echo     git tag v1.0.0
echo     git push origin v1.0.0
echo  The .exe installer will appear under Releases in ~6 minutes.
echo ============================================================
pause
