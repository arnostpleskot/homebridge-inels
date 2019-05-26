import nodeFetch from 'node-fetch'
import fetchCookie from 'fetch-cookie'
import sha1 from 'sha1'
import { URLSearchParams } from 'url'
import { CookieJar } from 'tough-cookie'
import R from 'ramda'
import { ILog } from '../types'

const jar = new CookieJar()
const fetch = fetchCookie(nodeFetch, jar)

type Methods = 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'UPDATE' | 'PUT'

class API {
  address: string
  username: string
  password: string
  log: ILog

  constructor(address: string, username: string, password: string, log: ILog) {
    this.address = address
    this.username = username
    this.password = password
    this.log = log
  }

  async call(url: string, method: Methods = 'GET', body?, options?, iteration = 0) {
    if (iteration > 1) {
      throw Error('Fetch was unsuccessful')
    }
    this.log.debug('Fetching...')

    const clearedUrl = `${R.head(url) === '/' ? R.tail(url) : url}`

    const fullUrl = clearedUrl === 'login' ? `http://${this.address}/login` : `http://${this.address}/api/${clearedUrl}`

    this.log.debug('method', method)
    const fullOptions = {
      ...options,
      method,
      body,
    }
    this.log.debug(fullUrl, fullOptions)
    const res = await fetch(fullUrl, fullOptions)

    if (res.ok) {
      if (res.headers.get('content-type')) {
        this.log.debug('Fetched')
        return await res.json()
      }

      return res
    } else {
      this.log('Status', res.status)
      if (res.status === 401) {
        this.log.debug('Needs to authenticate')
        await this.authenticate()
        return this.call(url, method, body, options, iteration + 1)
      } else {
        throw Error(res.statusText)
      }
    }
  }

  async authenticate() {
    this.log.debug('Authenticating...')
    try {
      const form = new URLSearchParams()
      form.append('name', this.username)
      form.append('key', String(sha1(this.password)))

      await this.call('/login', 'POST', form)
      this.log.debug('Authenticated')
    } catch (e) {
      this.log.error(e)
    }
  }
}

export default API
