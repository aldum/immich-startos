import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v2_4_1_0 = VersionInfo.of({
  version: '2.4.1:0',
  releaseNotes: 'Initial release for StartOS',
  migrations: {
    up: async ({ }) => {
    },
    down: IMPOSSIBLE,
  },
})
