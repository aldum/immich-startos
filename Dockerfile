FROM ghcr.io/imagegenius/immich:noml@sha256:1c2f9e13acab89a856da8bf2da2ee8a776282647d9e432be0222fc21f1ed9b01

ENV DEBIAN_FRONTEND=noninteractive
RUN apt update && apt -y install caddy

WORKDIR /app/immich/server
