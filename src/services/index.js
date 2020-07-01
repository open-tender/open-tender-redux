import { serialize } from 'open-tender-js'

const requestException = (message, response, exception, extracted) => {
  this.message = `${message || 'An unknown exception was triggered.'}`
  this.stack = new Error().stack
  this.response = response
  this.exception = exception
  this.extracted = extracted
}

const fiveHundredError = {
  status: 500,
  code: 'errors.server.internal',
  title: 'Internal Server Error',
  detail: 'Internal server error. Please contact support.',
}

const handleReponse = (response) => {
  const { status, statusText } = response
  if (status >= 500) {
    throw fiveHundredError
  }
  if (statusText === 'NO CONTENT' || status === 204) {
    return true
  }
  const requestWasSuccessful = status >= 200 && status < 300
  try {
    return response.json().then((parsed) => {
      if (requestWasSuccessful) return parsed
      throw parsed
    })
  } catch (err) {
    throw new requestException('Response could not be parsed', response, err)
  }
}

class OpenTenderAPI {
  constructor(config) {
    this.brandId = config.brandId
    this.clientId = config.clientId
    this.baseUrl = config.baseUrl
    this.authUrl = config.authUrl
  }

  request(endpoint, method = 'GET', data = null, timeout = null, token = null) {
    let didTimeOut = false
    return new Promise((resolve, reject) => {
      let timer
      if (timeout) {
        timer = setTimeout(() => {
          didTimeOut = true
          reject(new Error('Request timed out'))
        }, timeout)
      }
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'client-id': `${this.clientId}`,
        'brand-id': `${this.brandId}`,
      }
      if (token) headers.Authorization = `Bearer ${token}`
      let options = {
        method: method,
        headers: headers,
      }
      if (data) options.body = JSON.stringify(data)
      fetch(`${this.baseUrl}${endpoint}`, options)
        .then(handleReponse)
        .then((json) => {
          if (didTimeOut) return
          resolve(json)
        })
        .catch((err) => {
          if (didTimeOut) return
          err.code ? reject(err) : reject(fiveHundredError)
        })
        .finally(() => {
          if (timeout) clearTimeout(timer)
        })
    })
  }

  authRequest(endpoint, data) {
    return new Promise((resolve, reject) => {
      data.client_id = this.clientId
      const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: serialize(data),
      }
      fetch(`${this.authUrl}/oauth2${endpoint}`, options)
        .then((res) => res.json())
        .then((json) => {
          if (json.error) throw new Error(json.error_description)
          resolve(json)
        })
        .catch((err) => {
          reject(err)
        })
    })
  }

  getRevenueCenters(revenue_center_type, is_outpost, lat, lng) {
    // console.log('open-tender-redux', api)
    let params = `revenue_center_type=${revenue_center_type}`
    if (is_outpost) params += '&is_outpost=true'
    if (lat && lng) params += `&lat=${lat}&lng=${lng}`
    return this.request(`/revenue-centers?${params}`)
  }
}

export default OpenTenderAPI
