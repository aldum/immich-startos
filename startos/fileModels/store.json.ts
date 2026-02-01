import { matches, FileHelper } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const { object, string } = matches

const shape = object({
  admin: object({
    uuid: string,
    pwHash: string
  }).optional()
})

export const storeJson = FileHelper.json(
  {
    base: sdk.volumes.main,
    subpath: '/store.json',
  },
  shape,
)

/**
 * @description Read the store and throw an error if it's not present.
 * Since it should get created upon installation automatically, this is generally not a possible problem.
 * @returns storeJson
 *   */
export const unsafeReadStore = async () => {
  const store = await storeJson.read().once()
  if (!store) {
    throw new Error("Store is missing!")
  }
  return store
}
