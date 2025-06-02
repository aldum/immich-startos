import { VersionInfo, IMPOSSIBLE } from '@start9labs/start-sdk'

export const v1_134_0_1 = VersionInfo.of({
  version: '1.134.0:1',
  releaseNotes: 'Initial release for StartOS 0.4.0',
  migrations: {
    up: async ({ }) => {
    },
    down: IMPOSSIBLE,
  },
})
