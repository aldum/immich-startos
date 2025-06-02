FROM ghcr.io/imagegenius/immich:noml@sha256:8ddc1690cfddeaa6e5457f9aac5b9bf55bc7596fa39bac90dca4ad1e3cfbe04a

ENV DEBIAN_FRONTEND=noninteractive
RUN apt update && apt -y install caddy

WORKDIR /app/immich/server
