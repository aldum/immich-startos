import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v1_136_0_0 = VersionInfo.of({
  version: '1.136.0:0',
  releaseNotes: 'Initial release for StartOS',
  migrations: {
    up: async ({ }) => {
    },
    down: IMPOSSIBLE,
  },
})
