#!/bin/bash
cd "$(dirname "$0")"

echo "============================================"
echo "  MCQ Exam System - Starting local server"
echo "============================================"
echo ""

open_browser() {
  sleep 1
  if command -v open >/dev/null 2>&1; then
    open "http://localhost:8000/index.html"
  elif command -v xdg-open >/dev/null 2>&1; then
    xdg-open "http://localhost:8000/index.html"
  fi
}

if command -v python3 >/dev/null 2>&1; then
  echo "Starting server with Python3..."
  open_browser &
  python3 -m http.server 8000
elif command -v python >/dev/null 2>&1; then
  echo "Starting server with Python..."
  open_browser &
  python -m http.server 8000
elif command -v npx >/dev/null 2>&1; then
  echo "Python not found. Starting server with Node.js (npx)..."
  open_browser &
  npx --yes http-server -p 8000
else
  echo ""
  echo "ERROR: Neither Python nor Node.js was found on this computer."
  echo "Please install Python from https://www.python.org/downloads/ and run this file again."
  echo ""
  read -p "Press Enter to exit..."
fi
