import R from 'ramda'
import { ILog } from '../types'
import API from '../api'

export const getDevices = async (log: ILog, api: API) => {
  log.debug('Getting devices')

  try {
    const res = await api.call(`/devices`)
    return await Promise.all(
      R.compose(
        R.map(getDeviceDetail(log, api)),
        R.keys
      )(res)
    )
  } catch (e) {
    log.error(e)
  }
}

const getDeviceDetail = (log: ILog, api: API) => id => {
  log.debug(`Getting device: ${id}`)

  try {
    return api.call(`/devices/${id}`)
  } catch (e) {
    log.error(e)
  }
}
