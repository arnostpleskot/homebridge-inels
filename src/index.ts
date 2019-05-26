import inels from './api/'
import { getDevices } from './api/devices'
import R from 'ramda'
import {
  IService,
  HomebridgePlatform,
  IHomebridge,
  ILog,
  IConfigPlatform,
  IAPI,
  INelsAccessory,
  IAccessory,
} from './types'

let Service: IService
let Characteristic: any
let Accessory: any
let UUIDGen: { generate: (text: string) => string }

class Platform extends HomebridgePlatform {
  constructor(log: ILog, config: IConfigPlatform, api: IAPI) {
    super(log, config, api)

    this.log('iNELS Platform Plugin initialized')
    this.initAPI()
    this.accessories = []
    this.api = api

    if (this.api) {
      this.api.on('didFinishLaunching', async () => {
        this.log.debug('Fetching accessories')
        const devices = await getDevices(this.log, this.inels)
        this.log.debug('Fetched accessories:')
        R.map(this.addAccessory, devices)
        this.log.debug(devices)
      })
    }
  }

  public configureAccessory = function(accessory: IAccessory) {
    this.log(accessory.displayName, 'Configure Accessory')

    accessory.reachable = true

    accessory.on('identify', (paired, callback) => {
      this.log(accessory.displayName, 'Identify!!!')
      callback()
    })

    if (accessory.getService(Service.Lightbulb)) {
      accessory
        .getService(Service.Lightbulb)
        .getCharacteristic(Characteristic.On)
        .on('set', (value, callback) => {
          this.log(accessory.displayName, 'Light -> ' + value)
          callback()
        })
    }

    this.accessories.push(accessory)
  }

  public addAccessory = (accessory: INelsAccessory) => {
    this.log('Add Accessory', accessory['device info'].label)

    const uuid = UUIDGen.generate(accessory.id)

    const newAccessory: IAccessory = new Accessory(accessory['device info'].label, uuid)
    newAccessory.on('identify', (paired, callback) => {
      this.log(newAccessory.displayName, 'Identify!!!')
      callback()
    })

    newAccessory
      .addService(Service.Lightbulb, accessory['device info'].label)
      .getCharacteristic(Characteristic.On)
      .on('set', (value, callback) => {
        this.log(newAccessory.displayName, 'Light -> ' + value)
        callback()
      })

    this.accessories.push(newAccessory)
    this.api.registerPlatformAccessories('homebridge-inels', 'iNELS', [newAccessory])
  }

  public removeAccessory = () => {
    this.log('Remove Accessory')
    this.api.unregisterPlatformAccessories('homebridge-inels', 'iNELS', this.accessories)

    this.accessories = []
  }

  private initAPI = () => {
    this.inels = new inels(this.config.ipAddress, this.config.username, this.config.password, this.log)
  }
}

export default (homebridge: IHomebridge): void => {
  Service = homebridge.hap.Service
  Characteristic = homebridge.hap.Characteristic
  Accessory = homebridge.platformAccessory
  UUIDGen = homebridge.hap.uuid
  homebridge.registerPlatform('homebridge-inels', 'iNELS', Platform, true)
}
