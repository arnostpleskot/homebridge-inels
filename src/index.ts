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

type TLogFunction = (message: string) => void

interface IService {
  Switch: any
}

abstract class HomebridgePlatform {
  log: TLogFunction
  config: any

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

  accessories() {
    this.log('Fetch accessories')
  }
}

export default (homebridge: IHomebridge): void => {
  Service = homebridge.hap.Service
  Characteristic = homebridge.hap.Characteristic
  homebridge.registerPlatform('homebridge-inels', 'iNELS', Platform, true)
}
