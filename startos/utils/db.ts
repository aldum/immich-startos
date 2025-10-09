import { SubContainer } from '@start9labs/start-sdk'
import { manifest } from '../manifest'
import postgres from 'postgres'
import { sdk } from '../sdk'

const packageId = sdk.manifest.id
export const localDomain = `${packageId}.startos`

export const psqlDaemonUser = 'postgres'
export const psqlHost = 'localhost'
export const psqlUser = 'postgres'
export const psqlPass = 'postgres'
export const psqlDb = 'immich'
export const psqlPort = 5432

export class DB {
  private static sql = postgres({
    host: psqlHost,
    port: psqlPort,
    user: psqlUser,
    db: psqlDb,
    password: psqlPass,
  })

  private static usersTable = this.sql`public.user`

  static getAdminUsers = async () => {
    return this.sql`
      SELECT *
      FROM ${this.usersTable}
      WHERE isAdmin = true`
      .values()
  }

  static createUser = async (
    email: string,
    name: string,
    pwHash: string,
  ): Promise<string> => {
    const sql = this.sql
    const em = sql`${email}`
    const na = sql`${name}`
    const pw = sql`${pwHash}`

    // const placeholder = 'u_t'

    // const uid = await sql.begin(async conn => {
    //   await conn`ALTER TABLE ${this.usersTable} RENAME TO ${placeholder}`

    //   const id = await conn`
    //    INSERT INTO ${placeholder} (
    //      email, password, isAdmin,
    //      shouldChangePassword, name
    //    ) VALUES (
    //      ${em}, ${na}, ${pw},
    //      true, false
    //    )
    //    RETURNING id`

    //   await conn`ALTER TABLE ${placeholder} RENAME TO ${this.usersTable}`

    //   return id
    // })
    // return 'uid[0]'

    return this.sql`
      INSERT INTO ${this.usersTable} (
        email, password, name
      ) VALUES (
        ${em}, ${na}, ${pw}
      )
      RETURNING id`
      .values()
      .then((res) => res[0][0] as string)
  }
}


/*
type SubC = SubContainer<typeof manifest>
type Output = {
  stdout: string | Buffer
  stderr: string | Buffer
}

export class DB {
  private static usersTable = 'public.user'

  static queryRunner = (query: string): ((_: SubC) => Promise<Output>) => {
    const q = `SELECT json_agg(row_to_json(t)) FROM (${query}) t`
    return (subC: SubC) => {
      return subC.exec([
        'psql',
        '-h', psqlHost,
        '-U', psqlUser,
        '-d', psqlDb,
        '-q', // quiet
        '-A', // unaligned table output mode
        '-t', // print rows only
        '-c', q,
      ])
    }
  }

  static getUsers = this.queryRunner(
    `SELECT * FROM ${this.usersTable}`
  )

  static getAdminUserId = async (): Promise<string> => {
    return ''
    // return this.sql`
    //   SELECT id
    //   FROM ${this.usersTable}
    //   WHERE isAdmin = true
    //   `
    //   .values()
    //   .then((res) => res[0][0] as string)
  }

  // static test = async (
  //   subC: SubContainer<typeof manifest>,
  // ): Promise<number> => {
  //   const count = subC.exec([
  //     'psql',
  //     '-U',
  //     psqlUser,
  //     '-d',
  //     psqlDb,
  //     '-t',
  //     '-A',
  //     '-c',
  //     `'SELECT COUNT(*) FROM ${this.usersTable} WHERE "isAdmin" = true'`,
  //   ])

  //   const { stdout } = await count
  //   console.debug(stdout)
  //   const parsed = parseInt(stdout.toString(), 10)

  //   return Number.isNaN(parsed) ? 0 : parsed
  // }

  static createUser = async (
    email: string,
    name: string,
    pwHash: string,
  ): Promise<any> => this.queryRunner(
    `INSERT INTO ${this.usersTable} (
       email, name, password, isAdmin,
       shouldChangePassword
     )
     VALUES (
        ${email}, ${name}, ${pwHash},
        true, false
       )
     RETURNING id
    `
  )
  // {
  // const em = this.sql`${email}`
  // const pw = this.sql`${pwHash}`

  // return this.sql`
  //   INSERT INTO ${this.usersTable} (
  //     email, password, isAdmin,
  //     shouldChangePassword, name
  //   )
  //   VALUES (
  //     ${em}, ${pw}, true,
  //     false, Admin
  //     )
  //   RETURNING id
  //   `
  //   .values()
  //   .then((res) => res[0][0] as string)
  //   return ''
  // }

  static updateUserPassword = async (uuid: string, pwHash: string) => {
    // const id = this.sql`${uuid}`
    // const pw = this.sql`${pwHash}`
    // return this.sql`
    //   UPDATE ${this.usersTable}
    //   SET hashed_password = ${pw}
    //   WHERE id = ${id}
    //   `
  }

  static helth = async () => {
    // return this.sql`SELECT 1`.simple()
  }
}
*/
