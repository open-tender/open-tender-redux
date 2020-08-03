import { pending, fulfill, reject } from '../utils'
import {
  RESET_GROUP_ORDER,
  SHARE_CART,
  FETCH_GROUP_ORDER,
} from '../reducers/groupOrder'

// action creators

export const resetGroupOrder = () => ({ type: RESET_GROUP_ORDER })

// async action creators

export const shareCart = () => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(SHARE_CART))
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
    const { token } = await api.postCart(data)
    const payload = { token, isCartOwner: true }
    dispatch(fulfill(SHARE_CART, payload))
  } catch (err) {
    dispatch(reject(SHARE_CART, err))
  }
}

export const fetchGroupOrder = token => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(FETCH_GROUP_ORDER))
  try {
    const { cart_id, first_name, last_name, closed } = await api.getCart(token)
    const payload = {
      cartOwnerName: `${first_name} ${last_name}`,
      closed,
      token,
      cartId: cart_id,
    }
    dispatch(fulfill(FETCH_GROUP_ORDER, payload))
  } catch (err) {
    dispatch(reject(FETCH_GROUP_ORDER, err))
  }
}
