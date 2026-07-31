#!/usr/bin/env bash
set -euo pipefail

# Run the full IntelSense AI local stack from the repository root.
# This script starts the AI service, backend, and frontend in separate terminals.
# The backend uses its local H2 profile by default, so MySQL is optional.

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

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
  else
    echo "No supported terminal emulator found. Run the commands manually instead."
    echo "$cmd"
  fi
}

if command -v docker >/dev/null 2>&1 && docker info >/dev/null 2>&1; then
  if ! docker ps --format '{{.Names}}' | grep -q '^intelsense-mysql$'; then
    echo "Starting MySQL container (optional for local H2 mode)..."
    docker run --name intelsense-mysql \
      -e MYSQL_ROOT_PASSWORD=root \
      -e MYSQL_DATABASE=intelsense_ai \
      -e MYSQL_USER=Tanishg16 \
      -e MYSQL_PASSWORD=Tanish@2009 \
      -p 3306:3306 -d mysql:8.0 --default-authentication-plugin=mysql_native_password >/dev/null 2>&1 || true
  fi
else
  echo "Docker is unavailable; skipping optional MySQL container startup."
fi

if [ ! -d "$ROOT_DIR/ai-service/.venv" ]; then
  echo "Creating Python virtual environment for the AI service..."
  python3 -m venv "$ROOT_DIR/ai-service/.venv"
  "$ROOT_DIR/ai-service/.venv/bin/pip" install -e "$ROOT_DIR/ai-service"
fi

open_terminal "IntelSense AI Service" "cd '$ROOT_DIR/ai-service' && source .venv/bin/activate && uvicorn app.main:app --host 0.0.0.0 --port 8000"
open_terminal "IntelSense Backend" "cd '$ROOT_DIR/backend' && export JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 && export PATH=\"$JAVA_HOME/bin:$PATH\" && mvn -DskipTests spring-boot:run -Dspring-boot.run.profiles=local"
open_terminal "IntelSense Frontend" "cd '$ROOT_DIR/frontend' && npm install && npm run dev -- --host 0.0.0.0"

echo "All services launched. Open http://localhost:3000 (or 3001 if occupied) to access the app."
