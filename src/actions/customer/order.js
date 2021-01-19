import { pending, fulfill, reject, MISSING_CUSTOMER } from '../../utils'
import {
  RESET_CUSTOMER_ORDER,
  SET_CUSTOMER_ORDER,
  FETCH_CUSTOMER_ORDER,
  UPDATE_CUSTOMER_ORDER_RATING,
} from '../../reducers/customer/order'
import { selectToken } from '../../selectors/customer'
import { showNotification } from '../notifications'

// action creators

export const resetCustomerOrder = () => ({ type: RESET_CUSTOMER_ORDER })
export const setCustomerOrder = order => ({
  type: SET_CUSTOMER_ORDER,
  payload: order,
})

// async action creators

export const fetchCustomerOrder = orderId => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(FETCH_CUSTOMER_ORDER))
  const token = selectToken(getState())
  if (!token) return dispatch(reject(FETCH_CUSTOMER_ORDER, MISSING_CUSTOMER))
  try {
    const order = await api.getCustomerOrder(token, orderId)
    dispatch(fulfill(FETCH_CUSTOMER_ORDER, order))
  } catch (err) {
    dispatch(reject(FETCH_CUSTOMER_ORDER, err))
  }
}

export const updateCustomerOrderRating = (orderId, data) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token)
    return dispatch(reject(UPDATE_CUSTOMER_ORDER_RATING, MISSING_CUSTOMER))
  try {
    await api.putCustomerOrderRating(token, orderId, data)
    dispatch(fetchCustomerOrder(orderId))
    dispatch(showNotification('Rating updated!'))
  } catch (err) {
    dispatch(showNotification('Rating not updated'))
  }
}
