import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v2_0_0_0 = VersionInfo.of({
  version: '#noml:2.0.0:0',
  releaseNotes: 'Initial release for StartOS',
  migrations: {
    up: async ({ }) => {
    },
    down: IMPOSSIBLE,
  },
})
