import { makeSimpleCart, rehydrateCart } from '@open-tender/js'
import { pending, fulfill, reject, MISSING_CUSTOMER } from '../utils'
import {
  RESET_GROUP_ORDER,
  START_GROUP_ORDER,
  FETCH_GROUP_ORDER,
  UPDATE_GROUP_ORDER,
  DELETE_GROUP_ORDER,
  JOIN_GROUP_ORDER,
  RELOAD_GUEST_ORDER,
} from '../reducers/groupOrder'
import { setRequestedAt, setMenuVars, setCart, resetOrder } from './order'

// action creators

export const resetGroupOrder = () => ({ type: RESET_GROUP_ORDER })

// async action creators

export const makeCartPayload = (response, cartGuestId) => {
  const {
    customer = null,
    closed,
    cart_id: cartId,
    token,
    cart,
    revenue_center_id: revenueCenterId,
    service_type: serviceType,
    requested_at: requestedAt,
    cutoff_at: cutoffAt,
    spending_limit: spendingLimit,
    guest_limit: guestLimit,
    guest_count: guestCount,
    cart_quests: cartGuests,
  } = response
  const filteredCart = cartGuestId
    ? cart.filter(i => i.cart_guest_id === cartGuestId)
    : cart
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
    cart: filteredCart,
    cartGuests: cartGuests || [],
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

// id can be either a cartId or a token
export const fetchGroupOrder = id => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(FETCH_GROUP_ORDER))
  try {
    const response = await api.getCart(id)
    const { cartGuest } = getState().data.groupOrder
    const cartGuestId = cartGuest ? cartGuest.cartGuestId : null
    const payload = makeCartPayload(response, cartGuestId)
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
  const { cartId, cartGuest, isCartOwner } = getState().data.groupOrder
  try {
    data.cart = makeSimpleCart(getState().data.order.cart)
    if (isCartOwner) {
      const { customer_id } = getState().data.customer.account.profile
      data.customer_id = customer_id
    } else {
      data.cart_guest_id = cartGuest.cartGuestId
    }
    await api.putCart(cartId, data)
    dispatch(fetchGroupOrder(cartId))
    dispatch(fulfill(UPDATE_GROUP_ORDER))
  } catch (err) {
    await dispatch(fetchGroupOrder(cartId))
    dispatch(reject(UPDATE_GROUP_ORDER, err))
  }
}

export const reloadGuestOrder = () => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(RELOAD_GUEST_ORDER))
  try {
    const { revenueCenterId, serviceType } = getState().data.groupOrder
    const { cart: items } = getState().data.groupOrder
    const menuItems = await api.getMenuItems(revenueCenterId, serviceType)
    const { cart } = rehydrateCart(menuItems, items)
    dispatch(setCart(cart))
    dispatch(fulfill(RELOAD_GUEST_ORDER))
  } catch (err) {
    dispatch(reject(RELOAD_GUEST_ORDER, err))
  }
}
