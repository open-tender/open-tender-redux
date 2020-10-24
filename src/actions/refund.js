import { pending, fulfill } from '../utils'
import {
  RESET_REFUND,
  SET_REFUND,
  FETCH_PREVIOUS_REFUNDS,
  VALIDATE_REFUND,
  SUBMIT_REFUND,
} from '../reducers/refund'

// action creators

export const resetRefund = () => ({ type: RESET_REFUND })
export const setRefund = refund => ({
  type: SET_REFUND,
  payload: refund,
})

// async action creators

export const fetchPreviousRefunds = orderId => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(FETCH_PREVIOUS_REFUNDS))
  try {
    const args = { receipt_type: 'REFUND', parent_receipt_uuid: orderId }
    const orders = await api.getOrders(args)
    dispatch(fulfill(FETCH_PREVIOUS_REFUNDS, orders))
  } catch (err) {
    dispatch({ type: `${FETCH_PREVIOUS_REFUNDS}/rejected`, payload: err })
  }
}

export const validateRefund = (orderId, refund) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(VALIDATE_REFUND))
  try {
    const order = await api.postRefundValidate(orderId, refund)
    dispatch(fulfill(VALIDATE_REFUND, order))
  } catch (err) {
    dispatch({ type: `${VALIDATE_REFUND}/rejected`, payload: err })
  }
}

export const submitRefund = (orderId, refund) => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(SUBMIT_REFUND))
  try {
    const order = await api.postRefund(orderId, refund)
    dispatch(fulfill(SUBMIT_REFUND, order))
  } catch (err) {
    dispatch({ type: `${SUBMIT_REFUND}/rejected`, payload: err })
  }
}
