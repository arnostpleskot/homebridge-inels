import API from './api'
import { getDevices } from './devices'
import R from 'ramda'

interface IHomebridge {
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

type TLogFunction = (message: any) => void

interface IService {
  Switch: any
}

abstract class HomebridgePlatform {
  log: TLogFunction
  config: IConfig
  api: API

  protected constructor(log: TLogFunction, config: IConfig) {
    this.log = log
    this.config = config
  }
}

abstract class HomebridgeAccessory {
  log: TLogFunction

  protected constructor(log: TLogFunction, device: any, api: any) {
    this.log = log
  }
}

let Service: IService
let Characteristic: any

class Platform extends HomebridgePlatform {
  constructor(log, config) {
    super(log, config)

    this.log('iNELS Platform Plugin initialized')
  }

  initAPI() {
    this.api = new API(this.config.ipAddress, this.config.username, this.config.password, this.log)
  }

  async accessories() {
    this.initAPI()

    this.log('Fetch accessories')

    const devices = await getDevices(this.log, this.api)
    this.log('Found devices:')
    this.log(R.map(R.prop('device info'), devices))
  }
}

export default (homebridge: IHomebridge): void => {
  Service = homebridge.hap.Service
  Characteristic = homebridge.hap.Characteristic
  homebridge.registerPlatform('homebridge-inels', 'iNELS', Platform, true)
}
