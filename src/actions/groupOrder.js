import { makeSimpleCart } from '@open-tender/js'
import { pending, fulfill, reject } from '../utils'
import {
  RESET_GROUP_ORDER,
  START_GROUP_ORDER,
  FETCH_GROUP_ORDER,
  UPDATE_GROUP_ORDER,
  DELETE_GROUP_ORDER,
  JOIN_GROUP_ORDER,
} from '../reducers/groupOrder'
import {
  setRequestedAt,
  fetchRevenueCenter,
  setMenuVars,
  setCart,
  resetOrder,
} from './order'

// action creators

export const resetGroupOrder = () => ({ type: RESET_GROUP_ORDER })

// async action creators

const makeCartPayload = response => {
  const {
    customer,
    closed,
    cart_id: cartId,
    token,
    revenue_center_id: revenueCenterId,
    service_type: serviceType,
    requested_at: requestedAt,
    cutoff_at: cutoffAt,
    spending_limit: spendingLimit,
    guest_limit: guestLimit,
    guest_count: guestCount,
  } = response
  return {
    cartId,
    token,
    revenueCenterId,
    serviceType,
    requestedAt,
    cutoffAt,
    guestLimit,
    guestCount,
    spendingLimit,
    closed,
    cartOwner: customer,
  }
}

export const startGroupOrder = spendingLimit => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(START_GROUP_ORDER))
  try {
    const {
      revenueCenter,
      requestedAt,
      serviceType,
      cart,
    } = getState().data.order
    const { customer_id } = getState().data.customer.account.profile
    const limit = isNaN(spendingLimit)
      ? null
      : parseFloat(spendingLimit).toFixed(2)
    const data = {
      revenue_center_id: revenueCenter.revenue_center_id,
      requested_at: requestedAt,
      service_type: serviceType,
      cart: makeSimpleCart(cart),
      spending_limit: limit,
      customer_id,
    }
    const response = await api.postCart(data)
    const { requested_at } = response
    dispatch(setRequestedAt(requested_at))
    const payload = { ...makeCartPayload(response), isCartOwner: true }
    dispatch(fulfill(START_GROUP_ORDER, payload))
  } catch (err) {
    dispatch(reject(START_GROUP_ORDER, err))
  }
}

export const fetchGroupOrder = token => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(FETCH_GROUP_ORDER))
  try {
    const response = await api.getCart(token)
    const { revenue_center_id } = response
    dispatch(fetchRevenueCenter(revenue_center_id))
    const payload = makeCartPayload(response)
    dispatch(fulfill(FETCH_GROUP_ORDER, payload))
  } catch (err) {
    dispatch(reject(FETCH_GROUP_ORDER, err))
  }
}

export const removeGroupOrder = cartId => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(DELETE_GROUP_ORDER))
  try {
    await api.deleteCart(cartId)
    dispatch(fulfill(DELETE_GROUP_ORDER))
  } catch (err) {
    dispatch(reject(DELETE_GROUP_ORDER, err))
  }
}

export const joinGroupOrder = ({ cart_id, first_name, last_name }) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(JOIN_GROUP_ORDER))
  try {
    const data = { cart_id, first_name, last_name }
    const response = await api.postCartGuest(data)
    const {
      cart_guest_id: cartGuestId,
      first_name: firstName,
      last_name: lastName,
    } = response
    const { revenueCenter } = getState().data.order
    dispatch(resetOrder())
    const { serviceType, requestedAt } = getState().data.groupOrder
    dispatch(setMenuVars(revenueCenter, serviceType, requestedAt))
    dispatch(setCart([]))
    const payload = { cartGuestId, firstName, lastName }
    dispatch(fulfill(JOIN_GROUP_ORDER, payload))
  } catch (err) {
    dispatch(reject(JOIN_GROUP_ORDER, err))
  }
}

export const updateGroupOrder = (data = {}) => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(UPDATE_GROUP_ORDER))
  try {
    data.cart = makeSimpleCart(getState().data.order.cart)
    const { cartId, cartGuest, isCartOwner } = getState().data.groupOrder
    if (isCartOwner) {
      const { customer_id } = getState().data.customer.account.profile
      data.customer_id = customer_id
    } else {
      data.cart_guest_id = cartGuest.cartGuestId
    }
    await api.putCart(cartId, data)
    dispatch(fulfill(UPDATE_GROUP_ORDER))
  } catch (err) {
    dispatch(reject(UPDATE_GROUP_ORDER, err))
  }
}
