import inels from './api/'
import { getDevices, setDeviceState, getDeviceState } from './api/devices'
import R from 'ramda'
import { findInRegisteredAccessories } from './utils/index'
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
      })
    }
  }

  public configureAccessory = function(accessory: IAccessory) {
    this.log(accessory.displayName, 'Configure Accessory')

    accessory.reachable = true

    accessory.on('identify', (paired, callback) => {
      this.log.debug(accessory.displayName, 'Identify!!!')
      callback()
    })

    if (accessory.getService(Service.Lightbulb)) {
      accessory
        .getService(Service.Lightbulb)
        .getCharacteristic(Characteristic.On)
        .on('get', async callback => {
          const getState = getDeviceState(this.log, this.inels)
          const state = await getState(accessory.context.id)
          callback(null, state.on)
        })
        .on('set', (value, callback) => {
          this.log.debug(accessory.displayName, 'Light -> ' + value)
          setDeviceState(this.log, this.inels, accessory.context.id, { on: value })
          callback()
        })
    }

    this.accessories.push(accessory)
  }

  public addAccessory = (accessory: INelsAccessory) => {
    this.log.debug('Add Accessory', accessory['device info'].label)

    const registeredAccessory = findInRegisteredAccessories(this.accessories, accessory.id)
    if (registeredAccessory) {
      this.log.debug('Accessory is already registered')
      return this.configureAccessory(registeredAccessory)
    }

    const uuid = UUIDGen.generate(accessory.id)

    const newAccessory: IAccessory = new Accessory(accessory['device info'].label, uuid)
    newAccessory.context = {
      id: accessory.id,
    }

    newAccessory.addService(Service.Lightbulb, accessory['device info'].label)

    this.api.registerPlatformAccessories('homebridge-inels', 'iNELS', [newAccessory])
    this.configureAccessory(newAccessory)
  }

  public updateCharacteristic = async (accessory: IAccessory) => {
    const getState = getDeviceState(this.log, this.inels)
    const state = await getState(accessory.context.id)

    accessory.getService(Service.Lightbulb).updateCharacteristic(Characteristic.On, state.on)
    this.log(state)
  }

  public removeAccessory = () => {
    this.log.debug('Remove Accessory')
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
