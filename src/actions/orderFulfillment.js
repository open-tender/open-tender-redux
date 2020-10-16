import { makeFormErrors } from '@open-tender/js'
import { pending, fulfill, reject } from '../utils'
import {
  RESET_FULFILLMENT,
  FETCH_FULFILLMENT,
  UPDATE_FULFILLMENT,
} from '../reducers/orderFulfillment'
import { showNotification } from './notifications'

// action creators

export const resetOrderFulfillment = () => ({ type: RESET_FULFILLMENT })

// async action creators

export const fetchOrderFulfillment = orderId => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(FETCH_FULFILLMENT))
  try {
    const response = await api.getOrderFulfillment(orderId)
    dispatch(fulfill(FETCH_FULFILLMENT, response))
  } catch (err) {
    dispatch(reject(FETCH_FULFILLMENT, err))
  }
}

export const updateOrderFulfillment = (
  orderId,
  data,
  msg = 'Be right out with your order!'
) => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(UPDATE_FULFILLMENT))
  try {
    const response = await api.putOrderFulfillment(orderId, data)
    dispatch(fulfill(UPDATE_FULFILLMENT, response))
    dispatch(showNotification(msg))
  } catch (err) {
    const errors = makeFormErrors(err)
    dispatch(reject(UPDATE_FULFILLMENT, errors))
  }
}
