import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v2_0_1_0 = VersionInfo.of({
  version: '#noml:2.0.1:0',
  releaseNotes: 'Initial release for StartOS',
  migrations: {
    up: async ({ }) => {
    },
    down: IMPOSSIBLE,
  },
})
