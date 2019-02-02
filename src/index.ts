import API from './api'
import { getDevices } from './devices'
import R from 'ramda'
import { IService, HomebridgePlatform, IHomebridge } from './types'

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

    this.log.debug('Fetch accessories')

    const devices = await getDevices(this.log, this.api)
    this.log.debug('Fetched accessories:')
    this.log(R.map(R.prop('device info'), devices))
    this.log.debug(devices)
  }
}

export default (homebridge: IHomebridge): void => {
  Service = homebridge.hap.Service
  Characteristic = homebridge.hap.Characteristic
  homebridge.registerPlatform('homebridge-inels', 'iNELS', Platform, true)
}
