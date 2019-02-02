import API from './api'

export interface IHomebridge {
  hap: {
    Service: IService
    Characteristic: any
  }
  registerPlatform: (identifier: string, name: string, platform: typeof HomebridgePlatform, dynamic: boolean) => void
}

interface IConfig {
  name: string
  username: string
  password: string
  ipAddress: string
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
  Switch: any
}

export abstract class HomebridgePlatform {
  log: ILog
  config: IConfig
  api: API

  protected constructor(log: ILog, config: IConfig) {
    this.log = log
    this.config = config
  }
}

export abstract class HomebridgeAccessory {
  log: ILog

  protected constructor(log: ILog, device: any, api: any) {
    this.log = log
  }
}
