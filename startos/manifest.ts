import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'immich',
  title: 'Immich',
  license: 'MIT',
  wrapperRepo: 'https://github.com/aldum/immich-startos',
  upstreamRepo: 'https://github.com/immich-app/immich',
  supportSite: 'https://docs.start9.com/',
  marketingSite: 'https://immich.app',
  donationUrl: 'https://donate.start9.com/',
  description: {
    short: 'Self-hosted photo and video management solution',
    long: 'Easily back up, organize, and manage your photos on your own server. Immich helps you browse, search and organize your photos and videos with ease, without sacrificing your privacy.',
  },
  assets: ['valkey', 'immich'],
  volumes: ['main'],
  images: {
    'immich': {
      source: {
        dockerTag:
          'ghcr.io/imagegenius/immich:alpine',
      },
    },
    'db': {
      source: {
        dockerTag: 'tensorchord/pgvecto-rs:pg14-v0.2.0',
      },
    },
    'valkey': {
      source: {
        dockerTag: 'valkey/valkey:alpine',
      },
    },
  },
  hardwareRequirements: {},
  alerts: {
    install: 'Optional alert to display before installing the service',
    update: null,
    uninstall: null,
    restore: null,
    start: null,
    stop: null,
  },
  dependencies: {},
})
