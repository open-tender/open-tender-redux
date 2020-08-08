import { makeSimpleCart } from '@open-tender/js'
import { pending, fulfill, reject } from '../utils'
import {
  RESET_GROUP_ORDER,
  UPDATE_GROUP_ORDER,
  START_GROUP_ORDER,
  FETCH_GROUP_ORDER,
  JOIN_GROUP_ORDER,
  DELETE_GROUP_ORDER,
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
export const updateGroupOrder = data => ({
  type: UPDATE_GROUP_ORDER,
  payload: data,
})

// async action creators

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
    const {
      token,
      cart_id: cartId,
      requested_at,
      cutoff_at: cutoffAt,
      spending_limit,
      guest_limit: guestLimit,
    } = await api.postCart(data)
    dispatch(setRequestedAt(requested_at))
    const payload = {
      isCartOwner: true,
      token,
      cartId,
      requestedAt: requested_at,
      cutoffAt,
      spendingLimit: spending_limit,
      guestLimit,
    }
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
    const {
      first_name,
      last_name,
      closed,
      cart_id: cartId,
      revenue_center_id: revenueCenterId,
      service_type: serviceType,
      requested_at: requestedAt,
      cutoff_at: cutoffAt,
      spending_limit: spendingLimit,
      guest_limit: guestLimit,
      guest_count: guestCount,
    } = await api.getCart(token)
    const payload = {
      cartOwnerName: `${first_name} ${last_name}`,
      closed,
      token,
      cartId,
      revenueCenterId,
      serviceType,
      requestedAt,
      cutoffAt,
      spendingLimit,
      guestLimit,
      guestCount,
    }
    dispatch(fetchRevenueCenter(revenueCenterId))
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
    console.log(err)
    dispatch(reject(JOIN_GROUP_ORDER, err))
  }
}
