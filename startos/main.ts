import { sdk } from './sdk'
import { apiPort } from './utils'

export const main = sdk.setupMain(async ({ effects, started }) => {
  console.info('Starting Immich!')

  const valkey = await sdk.SubContainer.of(effects,
    { imageId: "valkey" },
    sdk.Mounts.of(),
    "valkey",
  )

  const dbEnv = {
    POSTGRES_USER: 'postgres',
    POSTGRES_PASSWORD: 'postgres',
    POSTGRES_DB: 'immich',
  }
  const dbMounts = sdk.Mounts.of()
    .mountVolume({
      volumeId: 'main',
      subpath: 'db',
      mountpoint: '/var/lib/postgresql/data',
      readonly: false
    })
    .mountAssets({
      subpath: "db",
      mountpoint: "/docker-entrypoint-initdb.d/"
    })
  const db = await sdk.SubContainer.of(effects,
    { imageId: "db" },
    dbMounts,
    "db"
  )
  await db.exec(['docker-ensure-initdb.sh'], {
    env: dbEnv,
  })
  // clean up pidfile
  await db.exec(['rm', '-f', '/var/lib/postgresql/data/postmaster.pid'], {
    env: dbEnv,
  })

  const immich = await sdk.SubContainer.of(effects,
    { imageId: "immich" },
    sdk.Mounts.of()
      .mountAssets({
        subpath: "immich",
        mountpoint: "/assets"
      })
      .mountVolume({
        volumeId: "main",
        subpath: "immich/photos",
        mountpoint: "/photos",
        readonly: false,
      }
      )
      .mountVolume({
        volumeId: "main",
        subpath: "immich/config",
        mountpoint: "/config",
        readonly: false,
      }
      ),
    "immich"
  )

  console.debug(
    `######### immich sc GUID: ${immich.guid}\n`,
    `######### postgr sc GUID: ${db.guid}\n`,
    // `######### valkey sc GUID: ${valkey.guid}`
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
          sdk.healthCheck.checkPortListening(effects, 6379, {
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
          sdk.healthCheck.checkPortListening(effects, 5432, {
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
