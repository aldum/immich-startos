import { sdk } from './sdk'
import * as dbSub from './subcontainers/db'
import { apiPort, psqlDb, psqlHost, psqlPass, psqlPort, psqlUser, valkeyPort } from './utils'

export const main = sdk.setupMain(async ({ effects }) => {
  console.info('Starting Immich!')

  const valkey = await sdk.SubContainer.of(
    effects,
    { imageId: 'valkey' },
    sdk.Mounts.of(),
    'valkey',
  )

  const dbEnv = dbSub.getEnv
  const db = await dbSub.getSubcontainer(effects)

  // clean up pidfile
  await db.exec(['rm', '-f', '/var/lib/postgresql/data/postmaster.pid'], {
    env: dbEnv,
  })

  const immich = await sdk.SubContainer.of(
    effects,
    { imageId: 'immich' },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: 'main',
        subpath: 'immich',
        mountpoint: '/data',
        readonly: false,
      }),
    'immich',
  )

  const daemons = sdk.Daemons.of(effects)
    .addDaemon('valkey', {
      subcontainer: valkey,
      exec: {
        command: 'valkey-server',
      },
      ready: {
        display: null,
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, valkeyPort, {
            successMessage: '',
            errorMessage: '',
          }),
      },
      requires: [],
    })
    .addDaemon('db', {
      subcontainer: db,
      exec: {
        command: sdk.useEntrypoint(),
        env: dbEnv,
      },
      ready: {
        display: null,
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, psqlPort, {
            successMessage: '',
            errorMessage: '',
          }),
      },
      requires: [],
    })
    .addDaemon('server', {
      subcontainer: immich,
      exec: {
        command: sdk.useEntrypoint(),
        runAsInit: true,
        env: {
          DB_HOSTNAME: psqlHost,
          DB_USERNAME: psqlUser,
          DB_PASSWORD: psqlPass,
          DB_DATABASE_NAME: psqlDb,
          REDIS_HOSTNAME: 'localhost',
        },
      },
      ready: {
        display: 'Immich API and web',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, apiPort, {
            successMessage: 'Immich is ready',
            errorMessage: '',
          }),
      },
      requires: ['db', 'valkey'],
    })

  return daemons
})
