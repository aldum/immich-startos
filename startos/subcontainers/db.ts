import { sdk } from '../sdk'
import { Effects } from '@start9labs/start-sdk/base/lib/Effects'
import { psqlDb, psqlPass, psqlUser } from '../utils/db'
import { SubContainer } from '@start9labs/start-sdk'
import { manifest } from '../manifest'

export const getEnv = {
  POSTGRES_USER: psqlUser,
  POSTGRES_PASSWORD: psqlPass,
  POSTGRES_DB: psqlDb,
}

export const mounts = sdk.Mounts.of()
  .mountVolume({
    volumeId: 'main',
    subpath: 'db',
    mountpoint: '/var/lib/postgresql/data',
    readonly: false,
  })

export const getSubcontainer = async (
  effects: Effects,
  name: string = 'dbSub',
) => await sdk.SubContainer.of(
  effects,
  { imageId: 'db', sharedRun: true },
  mounts,
  name,
)

type Manifest = typeof manifest
type runFn<T> = (subContainer: SubContainer<Manifest>) => Promise<T>

export const withTemp = async <T>(
  effects: Effects,
  fn: runFn<T>,
  name: string = 'dbSub-temp',
) =>
  await sdk.SubContainer.withTemp(
    effects, { imageId: 'db' }, mounts, name, fn)
