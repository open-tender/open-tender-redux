import { serialize } from '@open-tender/js'

const requestException = (message, response, exception, extracted) => {
  this.message = `${message || 'An unknown exception was triggered.'}`
  this.stack = new Error().stack
  this.response = response
  this.exception = exception
  this.extracted = extracted
}

const fiveHundredError = (status = 500, statusText = 'Unknown 500 error') => ({
  status: status,
  code: 'errors.server.internal',
  title: 'Internal Server Error',
  detail: statusText,
})

const unauthorizedError = {
  status: 401,
  code: 'errors.unauthorized',
  title: 'Unauthorized',
  detail: 'Provided token is not valid',
}

const handleResponse = response => {
  const { status, statusText } = response
  if (status >= 500) throw fiveHundredError(status, statusText)
  if (status === 401) throw unauthorizedError
  if (statusText === 'NO CONTENT' || status === 204) {
    return true
  }
  if (status === 202) {
    try {
      return response.body
    } catch (err) {
      throw new requestException('Response could not be parsed', response, err)
    }
  }
  const requestWasSuccessful = status >= 200 && status < 300
  try {
    return response.json().then(parsed => {
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
      }
      if (this.clientId) headers['client-id'] = `${this.clientId}`
      if (this.brandId) headers['brand-id'] = `${this.brandId}`
      if (token) headers.Authorization = `Bearer ${token}`
      let options = {
        method: method,
        headers: headers,
      }
      if (data) options.body = JSON.stringify(data)
      fetch(`${this.baseUrl}${endpoint}`, options)
        .then(handleResponse)
        .then(json => {
          if (didTimeOut) return
          resolve(json)
        })
        .catch(err => {
          if (didTimeOut) return
          err.code ? reject(err) : reject(fiveHundredError())
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
        .then(res => res.json())
        .then(json => {
          if (json.error) throw new Error(json.error_description)
          resolve(json)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  post(endpoint, data) {
    return this.request(`/${endpoint}`, 'POST', data)
  }

  getHttpResponse(code) {
    return this.request(`/${code}/cors`)
  }

  postSettings(entityType) {
    const params = entityType ? `&entity_type=${entityType}` : ''
    return this.request(`/settings/pull?force=true${params}`, 'POST', {})
  }

  getConfig() {
    return this.request(`/config`)
  }

  getLevelUpSettings() {
    return this.request(`/levelup`)
  }

  postChipDNATender(orderId, data) {
    return this.request(`/orders/${orderId}/tenders/chipdna`, 'POST', data)
  }

  postChipDNACancel() {
    return this.request(`/chipdna/cancel`, 'POST', {})
  }

  postChipDNATmsUpdate() {
    return this.request(`/chipdna/tms-update`, 'POST', {})
  }

  getBarcodeRead() {
    return this.request(`/devices/qrcode/read`)
  }

  postBarcodeCancel() {
    return this.request(`/devices/qrcode/cancel`, 'POST', {})
  }

  getCardRead() {
    return this.request(`/devices/card/read`)
  }

  postCardCancel() {
    return this.request(`/devices/card/cancel`, 'POST', {})
  }

  postCardAssign(employeeId, code) {
    const data = { employee_id: employeeId, code }
    return this.request(`/employee-cards/assign`, 'POST', data)
  }

  postCardUnassign(code) {
    return this.request(`/employee-cards/unassign`, 'POST', { code })
  }

  // identifier can be either a timeclock ID as an integer
  // or a swipe card code as a string
  getEmployee(identifier) {
    return this.request(`/employees/${identifier}`)
  }

  postTimePunch(data) {
    return this.request(`/time-punches`, 'POST', data)
  }

  getTimePunchesReport(businessDate, employeeId) {
    let params = []
    if (businessDate) params.push(`business_date=${businessDate}`)
    if (employeeId) params.push(`employee_id=${employeeId}`)
    params = params.length ? `?${params.join('&')}` : ''
    return this.request(`/time-punches-report${params}`)
  }

  postPrintShiftSummary(employeeId) {
    return this.request(`/shift-summary/${employeeId}/print`, 'POST', {})
  }

  postCashEvent(data) {
    return this.request(`/cash-events`, 'POST', data)
  }

  getCashier() {
    return this.request(`/cashier`)
  }

  getCashSummary(employeeId) {
    return this.request(`/cash-summary/${employeeId}`)
  }

  postPrintCashSummary(employeeId) {
    return this.request(`/cash-summary/${employeeId}/print`, 'POST', {})
  }

  getOfflineTransactions() {
    return this.request(`/credit/offline-transactions`)
  }

  postOfflineTransactions() {
    return this.request(`/credit/offline-transactions/process`, 'POST', {})
  }

  getSurcharges(serviceType) {
    const params = serviceType ? `?service_type=${serviceType}` : ''
    return this.request(`/surcharges${params}`)
  }

  getDiscounts(serviceType) {
    const params = serviceType ? `?service_type=${serviceType}` : ''
    return this.request(`/discounts${params}`)
  }

  getDiscount(name) {
    return this.request(`/discounts/${name}`)
  }

  getTaxes(serviceType, orderType) {
    let params = []
    if (serviceType) params.push(`service_type=${serviceType}`)
    if (orderType) params.push(`order_type=${orderType}`)
    params = params.length ? `?${params.join('&')}` : ''
    return this.request(`/taxes${params}`)
  }

  getItemTypes() {
    return this.request(`/item-types`)
  }

  getSelectOptions() {
    return this.request(`/select-options`)
  }

  postOpenCashDrawer() {
    return this.request(`/devices/drawer/open`, 'POST', {})
  }

  postTicketPrint(orderUuid, ticketNo, data) {
    const endpoint = `/orders/${orderUuid}/tickets/${ticketNo}/print`
    return this.request(endpoint, 'POST', data)
  }

  postTicketStatus(orderUuid, ticketNo, status) {
    const endpoint = `/orders/${orderUuid}/tickets/${ticketNo}/${status}`
    return this.request(endpoint, 'POST', {})
  }

  postTicketsPrint(orderUuid, data) {
    const endpoint = `/orders/${orderUuid}/tickets/print`
    return this.request(endpoint, 'POST', data)
  }

  postTicketsReset(orderUuid) {
    const endpoint = `/orders/${orderUuid}/tickets/reset`
    return this.request(endpoint, 'POST', {})
  }

  getArrivals() {
    return this.request(`/arrivals`)
  }

  postAcknowledgeArrival(orderUuid) {
    return this.request(`/orders/${orderUuid}/ack-arrival`, 'POST', {})
  }

  patchOrder(orderUuid, data) {
    return this.request(`/orders/${orderUuid}`, 'PATCH', data)
  }

  postReceipt(orderUuid) {
    const endpoint = `/orders/${orderUuid}/print`
    return this.request(endpoint, 'POST', {})
  }

  postGiftCardCredit(data, checkOnly) {
    const params = checkOnly ? '?check_only=true' : ''
    return this.request(`/gift-cards/credit${params}`, 'POST', data)
  }

  getGiftCardBalance(code, cardNumber) {
    const params = code ? `code=${code}` : `card_number=${cardNumber || ''}`
    return this.request(`/gift-cards/balance?${params}`)
  }

  getInternalSettings() {
    return this.request(`/internal-settings`)
  }

  postInternalSettings(data) {
    return this.request(`/internal-settings`, 'POST', data)
  }

  getStore() {
    return this.request(`/store`)
  }

  getRevenueCenters(revenue_center_type, is_outpost, lat, lng, requestedAt) {
    let params = ''
    if (revenue_center_type)
      params += `revenue_center_type=${revenue_center_type}`
    if (is_outpost) params += '&is_outpost=true'
    if (lat && lng) params += `&lat=${lat}&lng=${lng}`
    if (requestedAt) params += `&requested_at=${requestedAt}`
    return this.request(`/revenue-centers?${params}`)
  }

  getRevenueCenter(revenue_center_id, requestedAt) {
    const params = requestedAt ? `?requested_at=${requestedAt}` : ''
    return this.request(`/revenue-centers/${revenue_center_id}${params}`)
  }

  getValidTimes(revenueCenterType) {
    const params = `revenue_center_type=${revenueCenterType}`
    return this.request(`/valid-times?${params}`)
  }

  getAllergens() {
    return this.request(`/allergens`)
  }

  getMenu(revenueCenterId, serviceType, requestedAt) {
    const params = `revenue_center_id=${revenueCenterId}&service_type=${serviceType}&requested_at=${requestedAt}`
    return this.request(`/menus?${params}`)
  }

  getMenuItems(revenueCenterId, serviceType) {
    const params = `revenue_center_id=${revenueCenterId}&service_type=${serviceType}`
    return this.request(`/menu-items?${params}`)
  }

  getMenuPages() {
    return this.request(`/menu-pages`)
  }

  getDeals(customerId) {
    const params = customerId ? `&customer_id=${customerId}` : ''
    return this.request(`/deals?with_related=true${params}`)
  }

  getDiscountQRCode(discountId, customerId) {
    const params = customerId ? `?customer_id=${customerId}` : ''
    return this.request(`/discounts/${discountId}/qrcode${params}`)
  }

  postTender(orderId, tender) {
    return this.request(`/orders/${orderId}/tenders`, 'POST', tender)
  }

  patchTender(orderId, index, data) {
    return this.request(`/orders/${orderId}/tenders/${index}`, 'PATCH', data)
  }

  postTenderVoid(orderId, index) {
    return this.request(`/orders/${orderId}/tenders/${index}/void`, 'POST', {})
  }

  postIdentifyCustomer(data) {
    return this.request(`/identify-customer`, 'POST', data)
  }

  postApplePayValidate(host, validationURL) {
    const data = { host, validationURL }
    return this.request(`/apple-pay/validate`, 'POST', data)
  }

  postApplePayPayment(token, amount, customerId) {
    let data = { token, amount }
    if (customerId) {
      data = { ...data, customer_id: customerId }
    }
    return this.request(`/apple-pay/payment`, 'POST', data)
  }

  postOrderValidate(order) {
    return this.request(`/orders/validate`, 'POST', order)
  }

  postOrder(order) {
    return this.request(`/orders`, 'POST', order)
  }

  deleteOrder(order) {
    return this.request(`/orders`, 'DELETE', order)
  }

  getOrders(args) {
    let params = []
    if (!args) {
      params = [
        `prep_status=TODO,IN_PROGRESS,DONE`,
        `sort_by=fire_at`,
        `sort_direction=ASC`,
      ]
    } else {
      const {
        business_date,
        channel_type,
        prep_status,
        receipt_type,
        parent_receipt_uuid,
        search,
        sort_by,
        sort_direction,
      } = args
      if (business_date) params.push(`business_date=${business_date}`)
      if (channel_type) params.push(`channel_type=${channel_type}`)
      if (prep_status) params.push(`prep_status=${prep_status}`)
      if (receipt_type) params.push(`receipt_type=${receipt_type}`)
      if (parent_receipt_uuid)
        params.push(`parent_receipt_uuid=${parent_receipt_uuid}`)
      if (search) params.push(`search=${search}`)
      if (sort_by) params.push(`sort_by=${sort_by}`)
      if (sort_direction) params.push(`sort_direction=${sort_direction}`)
    }
    params = params.length ? `?${params.join('&')}` : ''
    return this.request(`/orders${params}`)
  }

  postRefundValidate(orderId, refund) {
    return this.request(`/orders/${orderId}/refund/validate`, 'POST', refund)
  }

  postRefund(orderId, refund) {
    return this.request(`/orders/${orderId}/refund`, 'POST', refund)
  }

  getOrderFulfillment(orderId) {
    return this.request(`/orders/${orderId}/fulfillment`)
  }

  putOrderFulfillment(orderId, data) {
    return this.request(`/orders/${orderId}/fulfillment`, 'PUT', data)
  }

  getOrderRating(ratingUuid) {
    return this.request(`/ratings/${ratingUuid}`)
  }

  putOrderRating(ratingUuid, data) {
    return this.request(`/ratings/${ratingUuid}`, 'PUT', data)
  }

  postOrderRatingUnsubscribe(ratingUuid) {
    return this.request(`/ratings/${ratingUuid}/unsubscribe`, 'POST', {})
  }

  postPurchaseGiftCards(data) {
    return this.request(`/gift-cards-purchase`, 'POST', data)
  }

  postPurchaseDonation(data) {
    return this.request(`/donation-purchase`, 'POST', data)
  }

  postCart(data) {
    return this.request(`/carts`, 'POST', data)
  }

  getCart(cartId) {
    return this.request(`/carts/${cartId}`)
  }

  putCart(cartId, data) {
    return this.request(`/carts/${cartId}`, 'PUT', data)
  }

  deleteCart(cartId) {
    return this.request(`/carts/${cartId}`, 'DELETE')
  }

  postCartGuest(data) {
    return this.request(`/cart-guests`, 'POST', data)
  }

  postSignUp(data) {
    return this.request(`/customer`, 'POST', data)
  }

  postLevelUp(data) {
    return this.request(`/levelup`, 'POST', data)
  }

  postThanxLogin(email) {
    return this.request('/thanx-login', 'POST', { email })
  }

  postThanxAuth(code) {
    return this.request('/thanx-auth', 'POST', { code })
  }

  postLogin(email, password) {
    const data = {
      grant_type: 'password',
      username: email,
      password: password,
    }
    return this.authRequest('/token', data)
  }

  postLogout(token) {
    return this.authRequest('/revoke', { token })
  }

  postSendPasswordResetEmail(email, link_url) {
    const data = { email, link_url }
    return this.request(`/customer/password/send-email`, 'POST', data)
  }

  postResetPassword(new_password, token) {
    const data = { new_password, token }
    return this.request(`/customer/password/set-new-password`, 'POST', data)
  }

  getCustomer(token) {
    return this.request(`/customer?with_related=true`, 'GET', null, null, token)
  }

  putCustomer(token, data) {
    return this.request(`/customer`, 'PUT', data, null, token)
  }

  postCustomerPosToken(token, posToken) {
    const data = { pos_token: posToken }
    return this.request(`/customer/pos-token`, 'POST', data, null, token)
  }

  postSendVerificationEmail(token, linkUrl) {
    const data = { link_url: linkUrl }
    return this.request(
      `/customer/send-verification-email`,
      'POST',
      data,
      null,
      token
    )
  }

  postVerifyAccount(verifyToken) {
    const data = { token: verifyToken }
    return this.request(`/verify-account`, 'POST', data)
  }

  getCustomerQRCode(token) {
    return this.request(`/customer/qrcode`, 'GET', null, null, token)
  }

  getCustomerOrders(token, limit, timing) {
    let params = []
    if (limit) params.push(`limit=${limit}`)
    if (timing) params.push(`requested_type=${timing}`)
    params = params.length ? `?${params.join('&')}` : ''
    return this.request(`/customer/orders${params}`, 'GET', null, null, token)
  }

  getCustomerOrder(token, orderId) {
    return this.request(`/customer/orders/${orderId}`, 'GET', null, null, token)
  }

  postCustomerGroupOrder(token, data) {
    return this.request(`/customer/carts`, 'POST', data, null, token)
  }

  getCustomerGroupOrders(token) {
    return this.request(`/customer/carts?expand=true`, 'GET', null, null, token)
  }

  getCustomerGroupOrder(token, cartId) {
    return this.request(
      `/customer/carts/${cartId}?expand=customer&with_related=true`,
      'GET',
      null,
      null,
      token
    )
  }

  putCustomerGroupOrder(token, cartId, data) {
    return this.request(`/customer/carts/${cartId}`, 'PUT', data, null, token)
  }

  putCustomerGroupOrderStatus(token, cartId, data) {
    return this.request(
      `/customer/carts/${cartId}/status`,
      'PUT',
      data,
      null,
      token
    )
  }

  deleteCustomerGroupOrder(token, cartId) {
    return this.request(
      `/customer/carts/${cartId}`,
      'DELETE',
      null,
      null,
      token
    )
  }

  getCustomerAllergens(token) {
    return this.request(`/customer/allergens`, 'GET', null, null, token)
  }

  // replace all existing allergens with a new list of allergens
  putCustomerAllergens(token, data) {
    return this.request(`/customer/allergens`, 'PUT', data, null, token)
  }

  // add new allergens incrementally without affecting existing allergens
  postCustomerAllergens(token, data) {
    return this.request(`/customer/allergens`, 'POST', data, null, token)
  }

  getCustomerAddresses(token, limit = 10) {
    const params = limit ? `?limit=${limit}` : ''
    return this.request(
      `/customer/addresses${params}`,
      'GET',
      null,
      null,
      token
    )
  }

  putCustomerAddress(token, addressId, data) {
    return this.request(
      `/customer/addresses/${addressId}`,
      'PUT',
      data,
      null,
      token
    )
  }

  deleteCustomerAddress(token, addressId) {
    return this.request(
      `/customer/addresses/${addressId}`,
      'DELETE',
      null,
      null,
      token
    )
  }

  getCustomerCreditCards(token, includeLinked = false) {
    const params = includeLinked ? `?include_linked=true` : ''
    return this.request(
      `/customer/credit-cards${params}`,
      'GET',
      null,
      null,
      token
    )
  }

  postCustomerCreditCard(token, data) {
    return this.request(`/customer/credit-cards`, 'POST', data, null, token)
  }

  putCustomerCreditCard(token, cardId, data) {
    return this.request(
      `/customer/credit-cards/${cardId}`,
      'PUT',
      data,
      null,
      token
    )
  }

  deleteCustomerCreditCard(token, cardId) {
    return this.request(
      `/customer/credit-cards/${cardId}`,
      'DELETE',
      null,
      null,
      token
    )
  }

  getCustomerGiftCards(token) {
    return this.request(`/customer/gift-cards`, 'GET', null, null, token)
  }

  postCustomerGiftCard(token, data) {
    return this.request(`/customer/gift-cards`, 'POST', data, null, token)
  }

  postCustomerGiftCardAssign(token, card_number) {
    return this.request(
      `/customer/gift-cards/assign`,
      'POST',
      { card_number },
      null,
      token
    )
  }

  postCustomerGiftCardAssignOther(token, giftCardId, email) {
    return this.request(
      `/customer/gift-cards/${giftCardId}/assign`,
      'POST',
      { email },
      null,
      token
    )
  }

  putCustomerGiftCard(token, giftCardId, data) {
    return this.request(
      `/customer/gift-cards/${giftCardId}`,
      'PUT',
      data,
      null,
      token
    )
  }

  deleteCustomerGiftCard(token, giftCardId) {
    return this.request(
      `/customer/gift-cards/${giftCardId}`,
      'DELETE',
      null,
      null,
      token
    )
  }

  getCustomerFavorites(token, limit) {
    const params = limit ? `?limit=${limit}` : ''
    return this.request(
      `/customer/favorites${params}`,
      'GET',
      null,
      null,
      token
    )
  }

  postCustomerFavorite(token, data) {
    return this.request(`/customer/favorites`, 'POST', data, null, token)
  }

  deleteCustomerFavorite(token, favoriteId) {
    return this.request(
      `/customer/favorites/${favoriteId}`,
      'DELETE',
      null,
      null,
      token
    )
  }

  getCustomerLoyalty(token) {
    return this.request(`/customer/loyalty`, 'GET', null, null, token)
  }

  getCustomerLevelUp(token) {
    return this.request(`/customer/levelup`, 'GET', null, null, token)
  }

  getCustomerThanx(token) {
    return this.request(`/customer/thanx`, 'GET', null, null, token)
  }

  postCustomerLevelUp(token, data) {
    return this.request(`/customer/levelup`, 'POST', data, null, token)
  }

  deleteCustomerLevelUp(token, levelupConnectId) {
    return this.request(
      `/customer/levelup/${levelupConnectId}`,
      'DELETE',
      null,
      null,
      token
    )
  }

  getCustomerHouseAccounts(token) {
    return this.request(`/customer/house-accounts`, 'GET', null, null, token)
  }

  putCustomerOrderRating(token, orderId, data) {
    return this.request(
      `/customer/orders/${orderId}/rating`,
      'PUT',
      data,
      null,
      token
    )
  }
}

export default OpenTenderAPI
