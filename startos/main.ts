import { sdk } from './sdk'
import * as dbSub from './subcontainers/db'
import { apiPort, psqlPort, valkeyPort } from './utils'

export const main = sdk.setupMain(async ({ effects, started }) => {
  console.info('Starting Immich!')

  const valkey = await sdk.SubContainer.of(effects,
    { imageId: "valkey" },
    sdk.Mounts.of(),
    "valkey",
  )

  const dbEnv = dbSub.getEnv
  const db = await dbSub.getSubcontainer(effects)

  // clean up pidfile
  await db.exec(['rm', '-f',
    '/var/lib/postgresql/data/postmaster.pid'], {
    env: dbEnv,
  })

  const immich = await sdk.SubContainer.of(effects,
    { imageId: "immich" },
    sdk.Mounts.of()
      .mountVolume({
        volumeId: "main",
        subpath: "immich/photos",
        mountpoint: "/photos",
        readonly: false,
      })
      .mountVolume({
        volumeId: "main",
        subpath: "immich/config",
        mountpoint: "/config",
        readonly: false,
      }),
    "immich"
  )

  const daemons = sdk.Daemons.of(effects, started)
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
            errorMessage: ''
          }),
      },
      requires: [],
    })
    .addDaemon('db', {
      subcontainer: db,
      exec: {
        command: ["gosu", "postgres", "postgres",
          "-c", "shared_preload_libraries=vchord.so",
          "-c", "search_path=\"$user\", public, vectors",
          "-c", "logging_collector=on"],
        env: dbEnv,
      },
      ready: {
        display: null,
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, psqlPort, {
            successMessage: '',
            errorMessage: ''
          }),
      },
      requires: [],
    })
    .addDaemon('server', {
      subcontainer: immich,
      exec: {
        command: ['/init'],
        runAsInit: true,
        env: {
          PUID: '911',
          PGID: '1000',
          DB_HOSTNAME: 'localhost',
          DB_USERNAME: 'postgres',
          DB_PASSWORD: 'postgres',
          DB_DATABASE_NAME: 'immich',
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
      requires: ["db", "valkey"],
    })

  return daemons
})
