import inels from '../api/'

interface IHomebridge {
  hap: {
    Service: IService
    Characteristic: any
    uuid: { generate: (text: string) => string }
  }
  platformAccessory: any
  registerPlatform: (identifier: string, name: string, platform: typeof HomebridgePlatform, dynamic: boolean) => void
  registerAccessory: (identifier: string, name: string, accessory: typeof HomebridgeAccessory) => void
}

interface IAccessory {
  on: (event: string, eventHandler: any) => IAccessory
  getCharacteristic: (characteristic: any) => IAccessory
  setCharacteristic: (characteristic: any, value: any) => IAccessory
  updateCharacteristic: (characteristic: any, value: any) => IAccessory
  setValue: (value: any) => IAccessory
  addService: (arg0: IService, name: string) => IAccessory
  getService: (arg0: IService) => IAccessory
  setPower: (arg0: boolean) => IAccessory
  reachable: boolean
  displayName: string
  context: {
    id: string
  }
}

interface IConfigPlatform {
  name: string
  username: string
  password: string
  ipAddress: string
}

interface IConfigAccessory extends IConfigPlatform {
  id: string
}

type TLogFunction = (...messages: any) => void
export interface ILog {
  readonly debug: TLogFunction
  readonly info: TLogFunction
  readonly warn: TLogFunction
  readonly error: TLogFunction
  readonly log: TLogFunction
  (...messages: any): void
}

export interface IService {
  Lightbulb: any
}

export interface IAPI {
  registerPlatformAccessories: (identifier: string, name: string, accessories: any[]) => void
  unregisterPlatformAccessories: (identifier: string, name: string, accessories: any[]) => void
  on: (eventName: string, callback: () => void) => void
}

export abstract class HomebridgePlatform {
  log: ILog
  config: IConfigPlatform
  api: IAPI
  inels: inels
  accessories: any[]

  constructor(log: ILog, config: IConfigPlatform, api: IAPI)
}

export abstract class HomebridgeAccessory {
  log: ILog
  config: IConfigAccessory
  inels: inels

  constructor(log: ILog, config: IConfigAccessory)
}

interface INelsAccessory {
  id: string
  'device info': {
    label: 'string'
    'product type': 'RFSA-66M'
    type: 'light'
    address: number
  }
  'actions info': {
    on: {
      type: string
    }
  }
  'primary actions': string[]
}
