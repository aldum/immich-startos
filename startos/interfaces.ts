import { sdk } from './sdk'
import { T } from '@start9labs/start-sdk'
import { uiPort } from './utils'

export const setInterfaces = sdk.setupInterfaces(
  async ({ effects }: { effects: T.Effects }) => {
    const uiMulti = sdk.MultiHost.of(effects, 'ui-multi')
    const uiMultiOrigin = await uiMulti.bindPort(uiPort, {
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

    return [uiReceipt]
  })
