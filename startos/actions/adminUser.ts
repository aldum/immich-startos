import { sdk } from '../sdk'
import { storeJson, unsafeReadStore } from '../fileModels/store.json'
import {
  defaultRandomString,
  generatePassword,
  hashPassword,
  DB,
} from '../utils'
import * as dbSub from '../subcontainers/db'
import { SubContainer } from '@start9labs/start-sdk'
import { manifest } from '../manifest'

const { InputSpec, Value } = sdk

export const inputSpec = InputSpec.of({
  email: Value.dynamicText(async () => {
    const adminExists = await storeJson.read((s) => s.admin).once()
    const disabled = adminExists ? 'You can change the email in the UI' : false
    return {
      name: 'Email',
      description: 'Admin email',
      required: true,
      default: null,
      inputmode: 'email',
      disabled: disabled,
      patterns: [
        {
          regex: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
          description: 'Must be a valid email address',
        },
      ],
    }
  }),
  username: Value.dynamicText(async ({ effects }) => {
    return {
      name: 'Username',
      description: '',
      disabled: false,
      required: true,
      default: null,
      patterns: [
        {
          regex: '^[a-zA-Z0-9_]+$',
          description: 'Must be alphanumeric (can contain underscore).',
        },
      ],
    }
  }),

  password: Value.dynamicText(async () => {
    const adminExists = await storeJson.read((s) => s.admin).once()

    const label = 'Password'
    const min = adminExists ? undefined : 10
    const warn = adminExists
      ? null
      : 'Store the password safely, we will not persist it.'
    const disabled = adminExists ? '' : false
    const gen = adminExists ? null : defaultRandomString

    return {
      name: label,
      description: null,
      warning: warn,
      disabled: disabled,
      required: true,
      masked: true,
      minLength: min,
      default: null,
      generate: gen,
      patterns: [],
    }
  }),
  new: Value.hidden<boolean>(),
})

export const adminUser = sdk.Action.withInput(
  'admin-user-ops',
  // metadata
  async ({ effects }) => {
    const adminUser =
      await storeJson.read((s) => s.admin).const(effects)
    // const label = adminUser ? 'Reset admin password' : 'Create admin user'

    const admins = await DB.getAdminUsers()
    const admin = admins[0]
    console.log(JSON.stringify(admins, null, 2))
    const label = admin ? 'Reset admin password' : 'Create admin user'

    return {
      name: label,
      description: '',
      warning: null,
      allowedStatuses: 'only-running',
      group: null,
      visibility: 'enabled',
    }
  },
  inputSpec,
  // prefill input
  async ({ effects }) => {
    const adminUser =
      await storeJson.read((s) => s.admin).once()

    if (adminUser) {
      return {
        email: adminUser.email,
        password: '',
        new: false,
      }
    } else {
      return {
        email: 'admin@immich.local',
        username: 'Admin',
        password: await generatePassword(),
        new: true,
      }
    }
  },
  // run
  async ({ effects, input }) => {
    const users = await DB.getAdminUsers()
    console.log('========== DB test ==========')
    console.log(JSON.stringify(users, null, 2))
    const pwHash = input.password // TODO: bcrypt
    console.log('----- create')
    const adminId = await DB.createUser(input.email, input.username, pwHash)
    console.log('|||||||||||||||||', adminId)

    // await dbSub.withTemp(effects, async (subc) => {
    //   const users = await DB.getUsers(subc)
    //   console.log('========== DB test ==========')
    //   console.log(JSON.stringify(users, null, 2))
    //   const pwHash = input.password // TODO: bcrypt

    //   console.log('----- create')
    //   const create = await DB.createUser(input.email, input.username, pwHash)
    //   const adminId = await create()
    //   console.log('|||||||||||||||||', adminId)
    // })

    // const db = await dbSub.getSubcontainer(effects, "admin-action")
    // await sdk.SubContainer.withTemp(
    //   effects,
    //   { imageId: 'db' },
    //   dbSub.mounts,
    //   'db-adminuser-action',
    //   async (subC) => {
    //     subC.execFail(
    //       ['docker-ensure-initdb.sh'],
    //       {
    //         env: dbSub.getEnv,
    //       }
    //     )
    //   }
    // )

    // const c = await getAdminUserCount(db)
  },
)
