import { sdk } from './sdk'
import { T } from '@start9labs/start-sdk'
import { uiPort } from './utils'

export const main = sdk.setupMain(async ({ effects, started }) => {
  console.info('Starting Immich!')


  const healthChecks: T.HealthCheck[] = []

  const valkey = await sdk.SubContainer.of(effects,
    { imageId: "valkey" },
    "valkey",
  )
  await valkey.exec(
    ['sysctl', 'vm.overcommit_memory=1']
  )

  const dbEnv = {
    POSTGRES_USER: 'postgres',
    POSTGRES_PASSWORD: 'postgres',
    POSTGRES_DB: 'immich',
  }
  const db = await sdk.SubContainer.of(effects,
    { imageId: "db" },
    "db"
  )
  await db.mount(
    {
      type: "volume",
      id: "main",
      subpath: "db",
      readonly: false
    },
    "/var/lib/postgresql/data",
  )
  const dbMounts = sdk.Mounts.of()
    .addVolume('main',
      'db',
      '/var/lib/postgresql/data',
      false)

  await db.exec(['docker-ensure-initdb.sh'], {
    env: dbEnv,
  })

  const immich = await sdk.SubContainer.of(effects,
    { imageId: "immich" },
    "immich"
  )
  immich.mount(
    {
      type: "assets",
      subpath: 'immich',
    },
    "/assets"
  )
  console.debug(
    `######### immich sc GUID: ${immich.guid}`
  )

  const daemons = sdk.Daemons.of(effects, started, healthChecks)
    .addDaemon('valkey', {
      subcontainer: valkey,
      command: 'valkey-server',
      mounts: sdk.Mounts.of(),
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
      subcontainer: { imageId: 'db' },
      command: ["gosu", "postgres", "postgres",
        "-c", "shared_preload_libraries=vectors.so",
        "-c", "search_path=\"$user\", public, vectors",
        "-c", "logging_collector=on"],
      mounts: dbMounts,
      ready: {
        display: null,
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, 5432, {
            successMessage: '',
            errorMessage: ''
          }),
      },
      env: dbEnv,
      requires: [],
    })
    .addDaemon('primary', {
      subcontainer: immich,
      command: ['/assets/init.sh'],
      mounts: sdk.Mounts.of()
        .addVolume('main',
          'immich',
          '/data',
          false),
      ready: {
        display: 'Web Interface',
        fn: () =>
          sdk.healthCheck.checkPortListening(effects, uiPort, {
            successMessage: 'The web interface is ready',
            errorMessage: 'The web interface is not ready',
          }),
      },
      env: {
        DB_HOSTNAME: 'localhost',
        DB_USERNAME: 'postgres',
        DB_PASSWORD: 'postgres',
        DB_DATABASE_NAME: 'immich',
        REDIS_HOSTNAME: 'localhost',
      },
      requires: ["db", "valkey"],
    })

  return daemons
})
