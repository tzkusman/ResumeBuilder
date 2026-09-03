#!/usr/bin/env bash
# ============================================================
#  ResumeBuild -> GitHub  (macOS / Linux)
#  1. Download the project ZIP from the workspace, unzip it.
#  2. Run:  bash scripts/push-to-github.sh
#     (from the unzipped folder, next to package.json)
# ============================================================
set -e
cd "$(dirname "$0")/.."

git init -b main
git add .
git commit -m "ResumeBuild v1.0.0 - ATS resume builder with SEO pages"
git remote remove origin 2>/dev/null || true
git remote add origin https://github.com/tzkusman/Resumebuild.git
git branch -M main
git push -u origin main

echo ""
echo "============================================================"
echo " Done! Code is on GitHub."
echo " Next: create the desktop release -"
echo "    git tag v1.0.0"
echo "    git push origin v1.0.0"
echo " The .exe installer will appear under Releases in ~6 minutes."
echo "============================================================"
