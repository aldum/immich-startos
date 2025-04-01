#!/bin/bash

function init() {
  cd /app/immich/server && node /app/immich/server/dist/main
}
function fallback() {
  while true; do
    echo "PONG"
    sleep 5
  done
}

echo ' ============ Init ============ '
sleep 1
init || fallback
