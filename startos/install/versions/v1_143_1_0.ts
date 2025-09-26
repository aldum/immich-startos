import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v1_143_1_0 = VersionInfo.of({
  version: '#noml:1.143.1:0',
  releaseNotes: 'Initial release for StartOS',
  migrations: {
    up: async ({ }) => {
    },
    down: IMPOSSIBLE,
  },
})
