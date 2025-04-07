FROM ghcr.io/imagegenius/immich:alpine

RUN apk add --no-cache caddy

WORKDIR /app/immich/server
