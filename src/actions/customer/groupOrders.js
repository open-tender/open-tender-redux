import {
  makeSimpleCart,
  rehydrateCart,
  timezoneMap,
  makeRequestedAtStr,
} from '@open-tender/js'
import { pending, fulfill, reject, MISSING_CUSTOMER } from '../../utils'
import { name, entity } from '../../reducers/customer/groupOrders'
import {
  REOPEN_GROUP_ORDER,
  FETCH_GROUP_ORDER,
  START_GROUP_ORDER,
  UPDATE_GROUP_ORDER,
  CLOSE_GROUP_ORDER,
} from '../../reducers/groupOrder'
import { selectToken } from '../../selectors/customer'
import { showNotification } from '../notifications'
import { makeCartPayload, resetGroupOrder } from '../groupOrder'
import {
  setRequestedAt,
  setCart,
  setRevenueCenter,
  setAlert,
  resetAlert,
  addMessage,
} from '../order'
import { checkAuth } from './account'

// action creators

export const resetCustomerGroupOrders = () => ({
  type: `${name}/reset${entity}`,
})
export const resetCustomerGroupOrdersError = () => ({
  type: `${name}/reset${entity}Error`,
})
export const setCustomerGroupOrders = orders => ({
  type: `${name}/set${entity}`,
  payload: orders,
})

// async action creators

export const fetchCustomerGroupOrders = () => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token)
    return dispatch(reject(`${name}/fetch${entity}`, MISSING_CUSTOMER))
  dispatch(pending(`${name}/fetch${entity}`))
  try {
    const orders = await api.getCustomerGroupOrders(token)
    dispatch(fulfill(`${name}/fetch${entity}`, orders))
  } catch (err) {
    dispatch(checkAuth(err, () => reject(`${name}/fetch${entity}`, err)))
  }
}

export const fetchCustomerGroupOrder = cartId => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token) return dispatch(reject(FETCH_GROUP_ORDER, MISSING_CUSTOMER))
  dispatch(pending(FETCH_GROUP_ORDER))
  try {
    const response = await api.getCustomerGroupOrder(token, cartId)
    const payload = { ...makeCartPayload(response), isCartOwner: true }
    dispatch(fulfill(FETCH_GROUP_ORDER, payload))
  } catch (err) {
    dispatch(checkAuth(err, () => reject(FETCH_GROUP_ORDER, err)))
  }
}

const makeCartData = (order, data = {}) => {
  const { address, revenueCenter, requestedAt, serviceType, cart } = order
  const orderData = {
    address,
    revenue_center_id: revenueCenter.revenue_center_id,
    service_type: serviceType,
    requested_at: requestedAt,
    cart: makeSimpleCart(cart),
  }
  const { spendingLimit } = data
  if (spendingLimit !== undefined) {
    delete data.spendingLimit
    orderData.spending_limit = isNaN(spendingLimit)
      ? null
      : parseFloat(spendingLimit).toFixed(2)
  }
  return { ...orderData, ...data }
}

export const addCustomerGroupOrder = (data, callback) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token) return dispatch(reject(START_GROUP_ORDER, MISSING_CUSTOMER))
  dispatch(pending(START_GROUP_ORDER))
  try {
    const cartData = makeCartData(getState().data.order, data)
    const response = await api.postCustomerGroupOrder(token, cartData)
    const customer = getState().data.customer.account.profile
    const payload = {
      ...makeCartPayload(response),
      isCartOwner: true,
      cartOwner: customer,
    }
    dispatch(fulfill(START_GROUP_ORDER, payload))
    if (callback) callback()
  } catch (err) {
    dispatch(checkAuth(err, () => reject(START_GROUP_ORDER, err)))
  }
}

export const updateCustomerGroupOrder = (cartId, data, callback) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token) return dispatch(reject(UPDATE_GROUP_ORDER, MISSING_CUSTOMER))
  dispatch(pending(UPDATE_GROUP_ORDER))
  try {
    const cartData = makeCartData(getState().data.order, data)
    await api.putCustomerGroupOrder(token, cartId, cartData)
    const response = await api.getCustomerGroupOrder(token, cartId)
    const { requestedAt, revenueCenter } = getState().data.order
    if (response.requested_at !== requestedAt) {
      dispatch(setRequestedAt(response.requested_at))
      const tz = timezoneMap[revenueCenter.timezone]
      const requestedAtText = makeRequestedAtStr(response.requested_at, tz)
      dispatch(addMessage(`Requested time updated to ${requestedAtText}`))
    }
    const payload = { ...makeCartPayload(response), isCartOwner: true }
    dispatch(fulfill(UPDATE_GROUP_ORDER, payload))
    if (callback) callback()
  } catch (err) {
    dispatch(checkAuth(err, () => reject(UPDATE_GROUP_ORDER, err)))
  }
}

export const closeGroupOrder = (cartId, closed) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token) return dispatch(reject(CLOSE_GROUP_ORDER, MISSING_CUSTOMER))
  dispatch(pending(CLOSE_GROUP_ORDER))
  try {
    await api.putCustomerGroupOrderStatus(token, cartId, { closed })
    dispatch(fulfill(CLOSE_GROUP_ORDER, closed))
  } catch (err) {
    dispatch(checkAuth(err, () => reject(CLOSE_GROUP_ORDER, err)))
  }
}

export const removeCustomerGroupOrder = (cartId, callback) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token)
    return dispatch(reject(`${name}/remove${entity}`, MISSING_CUSTOMER))
  dispatch(pending(`${name}/remove${entity}`))
  try {
    await api.deleteCustomerGroupOrder(token, cartId)
    dispatch(resetGroupOrder())
    const orders = await api.getCustomerGroupOrders(token)
    dispatch(fulfill(`${name}/remove${entity}`, orders))
    dispatch(showNotification('Group order deleted!'))
    if (callback) callback()
  } catch (err) {
    dispatch(checkAuth(err, () => reject(`${name}/remove${entity}`, err)))
  }
}

export const reopenGroupOrder = cart => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token) return dispatch(reject(REOPEN_GROUP_ORDER, MISSING_CUSTOMER))
  const alert = { type: 'working', args: { text: 'Building your order...' } }
  dispatch(setAlert(alert))
  dispatch(pending(REOPEN_GROUP_ORDER))
  try {
    // await dispatch(fetchRevenueCenter(revenue_center_id))
    const { revenue_center_id, service_type, requested_at, cart_id } = cart
    const revenueCenter = await api.getRevenueCenter(revenue_center_id)
    dispatch(setRevenueCenter(revenueCenter))
    const menuItems = await api.getMenuItems(revenue_center_id, service_type)
    const data = { revenue_center_id, requested_at, service_type }
    const response = await api.putCustomerGroupOrder(token, cart_id, data)
    dispatch(setRequestedAt(response.requested_at))
    const customer = getState().data.customer.account.profile
    const { customer_id } = customer
    const items = response.cart.filter(i => i.customer_id === customer_id)
    const { cart: customerCart } = rehydrateCart(menuItems, items)
    dispatch(setCart(customerCart))
    const payload = {
      ...makeCartPayload(response),
      isCartOwner: true,
      cartOwner: customer,
    }
    dispatch(fulfill(REOPEN_GROUP_ORDER, payload))
    dispatch(showNotification('Group order reopened!'))
    dispatch(setAlert({ type: 'groupOrder' }))
  } catch (err) {
    dispatch(resetAlert())
    dispatch(addMessage('Something went wrong. Please contact support.'))
    dispatch(checkAuth(err, () => reject(REOPEN_GROUP_ORDER, null)))
  }
}
