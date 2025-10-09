import { SubContainer } from '@start9labs/start-sdk'
import { manifest } from '../manifest'
import { sdk } from '../sdk'

const packageId = sdk.manifest.id
export const localDomain = `${packageId}.startos`

export const psqlDaemonUser = 'postgres'
// export const psqlHost = `db.${localDomain}`
export const psqlHost = 'localhost'
export const psqlUser = 'postgres'
export const psqlPass = 'postgres'
export const psqlDb = 'immich'
export const psqlPort = 5432

