import { Effects } from '@start9labs/start-sdk/base/lib/Effects'
import * as dbSub from '../subcontainers/db'
import { sdk } from '../sdk'

export const createDb =
  async (effects: Effects) => {
    const dbEnv = dbSub.getEnv

    await sdk.SubContainer.withTemp(effects,
      { imageId: "db" },
      dbSub.mounts,
      "create-db",
      (subC) => subC.execFail(
        ['docker-ensure-initdb.sh'],
        {
          env: dbEnv,
        }
      )
    )

  }
