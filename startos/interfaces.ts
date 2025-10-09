import { sdk } from './sdk'
import { T } from '@start9labs/start-sdk'
import { apiPort, psqlPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(
  async ({ effects }: { effects: T.Effects }) => {
    const uiMulti = sdk.MultiHost.of(effects, 'ui-multi')
    const uiMultiOrigin = await uiMulti.bindPort(apiPort, {
      protocol: 'http',
    })
    const ui = sdk.createInterface(effects, {
      name: 'Web UI',
      id: 'ui',
      description: 'The web interface',
      type: 'ui',
      masked: false,
      schemeOverride: null,
      username: null,
      path: '',
      query: {},
    })

    const uiReceipt = await uiMultiOrigin.export([ui])

    const dbMulti = sdk.MultiHost.of(effects, 'db')
    const dbMultiOrigin = await dbMulti.bindPort(psqlPort, {
      // protocol: 'http'
      protocol: null,
      addSsl: null,
      preferredExternalPort: psqlPort,
      secure: { ssl: true },
    })
    const db = sdk.createInterface(effects, {
      name: 'DB (dev)',
      id: 'db',
      description: 'DB',
      type: 'api',
      masked: false,
      schemeOverride: null,
      username: null,
      path: '',
      query: {},
    })
    const dbReceipt = await dbMultiOrigin.export([db])

    const ifaceReceipts = [uiReceipt, dbReceipt]
    // const ifaceReceipts = [uiReceipt]
    return ifaceReceipts
  },
)
