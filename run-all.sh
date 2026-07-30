#!/usr/bin/env bash
set -euo pipefail

# Run the full IntelSense AI local stack from the repository root.
# This script launches the AI service, backend, and frontend in separate terminals.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if ! command -v gnome-terminal >/dev/null 2>&1 && ! command -v x-terminal-emulator >/dev/null 2>&1 && ! command -v konsole >/dev/null 2>&1 && ! command -v xfce4-terminal >/dev/null 2>&1; then
  echo "No supported terminal emulator found. Install gnome-terminal, x-terminal-emulator, konsole, or xfce4-terminal."
  exit 1
fi

open_terminal() {
  local title="$1"
  local cmd="$2"

  if command -v gnome-terminal >/dev/null 2>&1; then
    gnome-terminal --title "$title" -- bash -lc "$cmd; exec bash"
  elif command -v x-terminal-emulator >/dev/null 2>&1; then
    x-terminal-emulator -T "$title" -e bash -lc "$cmd; exec bash"
  elif command -v konsole >/dev/null 2>&1; then
    konsole --new-tab -p tabtitle="$title" -e bash -lc "$cmd; exec bash"
  elif command -v xfce4-terminal >/dev/null 2>&1; then
    xfce4-terminal --title "$title" --command="bash -lc '$cmd; exec bash'"
  fi
}

# 1. Start MySQL if not already running
if ! docker ps --format '{{.Names}}' | grep -q '^intelsense-mysql$'; then
  echo "Starting local MySQL container..."
  docker run --name intelsense-mysql \
    -e MYSQL_ROOT_PASSWORD=root \
    -e MYSQL_DATABASE=intelsense_ai \
    -e MYSQL_USER=Tanishg16 \
    -e MYSQL_PASSWORD=Tanish@2009 \
    -p 3306:3306 -d mysql:8.0 --default-authentication-plugin=mysql_native_password
else
  echo "MySQL container already running."
fi

# 2. Start Redis if not already running
if ! docker ps --format '{{.Names}}' | grep -q '^intelsense-redis$'; then
  echo "Starting local Redis container..."
  docker run --name intelsense-redis -p 6379:6379 -d redis:7
else
  echo "Redis container already running."
fi

# 3. Launch AI service
open_terminal "IntelSense AI Service" "cd '$ROOT_DIR/ai-service' && source .venv/bin/activate 2>/dev/null || true && uvicorn app.main:app --host 0.0.0.0 --port 8000"

# 4. Launch backend
open_terminal "IntelSense Backend" "cd '$ROOT_DIR/backend' && mvn spring-boot:run"

# 5. Launch frontend
open_terminal "IntelSense Frontend" "cd '$ROOT_DIR/frontend' && npm install && npm run dev -- --host 0.0.0.0"

echo "All services launched. Open http://localhost:3000 to access the app."
