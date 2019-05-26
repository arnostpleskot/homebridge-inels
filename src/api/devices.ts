import R from 'ramda'
import { ILog } from '../types'
import API from './'

export const getDevices = async (log: ILog, api: API) => {
  log.debug('Getting devices')

  try {
    const res = await api.call(`/devices`)
    return await Promise.all(
      R.compose(
        R.map(getDeviceDetail(log, api)),
        // R.map(getDeviceState(log, api)),
        R.keys
      )(res)
    )
  } catch (e) {
    log.error(e)
  }
}

const getDeviceDetail = (log: ILog, api: API) => (id: string) => {
  log.debug(`Getting device: ${id}`)

  try {
    return api.call(`/devices/${id}`)
  } catch (e) {
    log.error(e)
  }
}

const getDeviceState = (log: ILog, api: API) => async (id: string) => {
  log.debug(`Getting status of device: ${id}`)

  try {
    return await api.call(`/devices/${id}/state`)
  } catch (e) {
    log.error(e)
  }
}

const setDeviceState = (log: ILog, api: API, id: string) => {
  log.debug(`Putting state into device: ${id}`)

  try {
    const body = new URLSearchParams()
    body.append('on', 'true')

    return api.call(`/devices/${id}/state`, 'PUT', body)
  } catch (e) {
    log.error(e)
  }
}
