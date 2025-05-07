import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v1_131_3_1 = VersionInfo.of({
  version: '1.131.3:1',
  releaseNotes: 'Initial release for StartOS 0.4.0',
  migrations: {
    up: async ({ }) => {
    },
    down: IMPOSSIBLE,
  },
})
