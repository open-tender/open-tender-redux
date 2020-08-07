import { pending, fulfill, reject } from '../utils'
import {
  RESET_GROUP_ORDER,
  UPDATE_GROUP_ORDER,
  START_GROUP_ORDER,
  FETCH_GROUP_ORDER,
} from '../reducers/groupOrder'
import { setRequestedAt, fetchRevenueCenter } from './order'

// action creators

export const resetGroupOrder = () => ({ type: RESET_GROUP_ORDER })
export const updateGroupOrder = data => ({
  type: UPDATE_GROUP_ORDER,
  payload: data,
})

// async action creators

export const startGroupOrder = () => async (dispatch, getState) => {
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
    const data = {
      revenue_center_id: revenueCenter.revenue_center_id,
      requested_at: requestedAt,
      service_type: serviceType,
      cart,
      customer_id,
    }
    const { token, cart_id, cutoff_at, requested_at } = await api.postCart(data)
    dispatch(setRequestedAt(requested_at))
    const payload = {
      token,
      isCartOwner: true,
      cartId: cart_id,
      cutoffAt: cutoff_at,
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
    }
    dispatch(fetchRevenueCenter(revenueCenterId))
    dispatch(fulfill(FETCH_GROUP_ORDER, payload))
  } catch (err) {
    dispatch(reject(FETCH_GROUP_ORDER, err))
  }
}
