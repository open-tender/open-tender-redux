import { makeSimpleCart, rehydrateCart } from '@open-tender/js'
import { pending, fulfill, reject, MISSING_CUSTOMER } from '../../utils'
import { name, entity } from '../../reducers/customer/groupOrders'
import {
  REOPEN_GROUP_ORDER,
  FETCH_GROUP_ORDER,
  UPDATE_GROUP_ORDER,
} from '../../reducers/groupOrder'
import { selectToken } from '../../selectors/customer'
import { showNotification } from '../notifications'
import { makeCartPayload } from '../groupOrder'
import {
  fetchRevenueCenter,
  setRequestedAt,
  setCart,
  setRevenueCenter,
  setAlert,
  resetAlert,
  addMessage,
} from '../order'

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
    dispatch(reject(`${name}/fetch${entity}`, err))
  }
}

export const fetchCustomerGroupOrder = cartId => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token) return dispatch(reject(FETCH_GROUP_ORDER, MISSING_CUSTOMER))
  dispatch(pending(FETCH_GROUP_ORDER))
  try {
    const orders = await api.getCustomerGroupOrder(token, cartId)
    dispatch(fulfill(FETCH_GROUP_ORDER, orders))
  } catch (err) {
    dispatch(reject(FETCH_GROUP_ORDER, err))
  }
}

export const updateCustomerGroupOrder = (cartId, data, callback) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token)
    return dispatch(reject(`${name}/update${entity}`, MISSING_CUSTOMER))
  dispatch(pending(`${name}/update${entity}`))
  try {
    await api.putCustomerGroupOrder(token, cartId, data)
    const response = await api.getCustomerGroupOrder(token, cartId)
    const payload = { ...makeCartPayload(response), isCartOwner: true }
    dispatch(fulfill(UPDATE_GROUP_ORDER, payload))
    dispatch(showNotification('Group order updated!'))
    if (callback) callback()
  } catch (err) {
    dispatch(reject(`${name}/update${entity}`, err))
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
    const orders = await api.getCustomerGroupOrders(token)
    dispatch(fulfill(`${name}/remove${entity}`, orders))
    dispatch(showNotification('Group order deleted!'))
    if (callback) callback()
  } catch (err) {
    dispatch(reject(`${name}/remove${entity}`, err))
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
    const { customer_id } = getState().data.customer.account.profile
    const items = response.cart.filter(i => i.customer_id === customer_id)
    const { cart: customerCart } = rehydrateCart(menuItems, items)
    dispatch(setCart(customerCart))
    const payload = { ...makeCartPayload(response), isCartOwner: true }
    dispatch(fulfill(REOPEN_GROUP_ORDER, payload))
    dispatch(showNotification('Group order reopened!'))
    dispatch(setAlert({ type: 'groupOrder' }))
  } catch (err) {
    dispatch(resetAlert())
    dispatch(addMessage('Something went wrong. Please contact support.'))
    dispatch(reject(REOPEN_GROUP_ORDER, null))
  }
}
