import R from 'ramda'

export const getDevices = async (log, api) => {
  log('Getting devices')

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

const getDeviceDetail = (log, api) => id => {
  log(`Getting device: ${id}`)

  try {
    return api.call(`/devices/${id}`)
  } catch (e) {
    log.error(e)
  }
}
