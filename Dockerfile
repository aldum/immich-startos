FROM ghcr.io/imagegenius/immich:noml@sha256:371c1e15b666cd184e7980fae613d3865703148c3e8b3259c65de03ba593d25c

ENV DEBIAN_FRONTEND=noninteractive
RUN apt update && apt -y install caddy

WORKDIR /app/immich/server
