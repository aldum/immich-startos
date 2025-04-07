#!/bin/bash

function init() {
  # cd /app/immich/server && node /app/immich/server/dist/main
  mkdir -p /build
  ln -s /usr/src/resources/ /build/geodata
  node /app/immich/server/dist/main &
  caddy run --config /assets/Caddyfile &
  wait -n
}
function fallback() {
  while true; do
    echo "PONG"
    sleep 15
  done
}

echo ' ============ Init ============ '
sleep 1
init || fallback
