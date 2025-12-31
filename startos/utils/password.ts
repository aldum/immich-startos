import { utils } from '@start9labs/start-sdk'
const bcrypt = import("bcrypt-ts")

export const defaultRandomString = {
  charset: 'a-z,A-Z,1-9',
  len: 22,
}

export const generatePassword = async (
  chars: string = defaultRandomString.charset,
  l: number = defaultRandomString.len
) => utils.getDefaultString(
  {
    charset: chars,
    len: l,
  }
)

export const hashPassword =
  async (plain: string) => {
    const bc = await bcrypt
    const rounds = 10
    const salt = await bc.genSalt(rounds)
    return bc.hash(plain, salt)
  }
