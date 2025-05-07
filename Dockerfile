FROM ghcr.io/imagegenius/immich:alpine@sha256:d370bb5a40c283faf466d7c4eee185c84adbd1119bd83b5aef44d43973525f94

RUN apk add --no-cache caddy

WORKDIR /app/immich/server
