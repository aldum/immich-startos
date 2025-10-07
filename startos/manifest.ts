import { setupManifest } from '@start9labs/start-sdk'
import { SDKImageInputSpec } from '@start9labs/start-sdk/base/lib/types/ManifestTypes'

const BUILD = process.env.BUILD || ''

const architectures =
  BUILD === 'x86_64' || BUILD === 'aarch64' ? [BUILD] : ['x86_64', 'aarch64']

export const manifest = setupManifest({
  id: 'immich',
  title: 'Immich',
  license: 'MIT',
  wrapperRepo: 'https://github.com/aldum/immich-startos',
  upstreamRepo: 'https://github.com/immich-app/immich',
  supportSite: 'https://docs.start9.com/',
  marketingSite: 'https://immich.app',
  donationUrl: 'https://immich.app/docs/overview/support-the-project',
  docsUrl: 'https://immich.app/docs/overview/welcome',
  description: {
    short: 'Self-hosted photo and video management solution',
    long: 'Easily back up, organize, and manage your photos on your own server. Immich helps you browse, search and organize your photos and videos with ease, without sacrificing your privacy.',
  },

  // assets: ['valkey', 'immich', 'db'],
  volumes: ['main'],
  images: {
    'immich': {
      arch: architectures,
      source: {
        // dockerBuild: {}
        dockerTag: 'ghcr.io/imagegenius/immich:2.0.1-noml'
      },
    } as SDKImageInputSpec,
    'db': {
      arch: architectures,
      source: {
        dockerTag: 'ghcr.io/immich-app/postgres:14-vectorchord0.3.0-pgvectors0.2.0',
      },
    } as SDKImageInputSpec,
    'valkey': {
      arch: architectures,
      source: {
        dockerTag: 'valkey/valkey:alpine',
      },
    } as SDKImageInputSpec,
  },
  hardwareRequirements: { arch: architectures },
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
