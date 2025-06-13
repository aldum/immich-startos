FROM ghcr.io/imagegenius/immich:noml@sha256:034e2119862174091a9da644a0ea48ef3f39ec97d55dcf665397e9bef87147e6

ENV DEBIAN_FRONTEND=noninteractive
RUN apt update && apt -y install caddy

WORKDIR /app/immich/server
