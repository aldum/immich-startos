import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

export const v0361 = VersionInfo.of({
  version: '0.3.6:1',
  releaseNotes: 'Revamped for StartOS 0.3.6',
  migrations: {
    up: async ({ effects }) => {
    },
    down: IMPOSSIBLE,
  },
})
