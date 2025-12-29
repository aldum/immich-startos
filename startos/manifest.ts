import { setupManifest } from '@start9labs/start-sdk'

export const manifest = setupManifest({
  id: 'immich',
  title: 'Immich',
  license: 'MIT',
  wrapperRepo: 'https://github.com/aldum/immich-startos',
  upstreamRepo: 'https://github.com/immich-app/immich',
  supportSite: 'https://github.com/aldum/immich-startos/issues',
  marketingSite: 'https://immich.app',
  donationUrl: 'https://immich.app/docs/overview/support-the-project',
  docsUrl: 'https://immich.app/docs/overview/welcome',
  description: {
    short: 'Self-hosted photo and video management solution',
    long: 'Easily back up, organize, and manage your photos on your own server. Immich helps you browse, search and organize your photos and videos with ease, without sacrificing your privacy.',
  },

  volumes: ['main'],
  images: {
    'immich': {
      source: {
        dockerTag: 'ghcr.io/immich-app/immich-server:v2.4.1'
      },
    },
    'db': {
      source: {
        dockerTag: 'ghcr.io/immich-app/postgres:17-vectorchord0.4.3-pgvector0.8.1-pgvectors0.3.0',
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
