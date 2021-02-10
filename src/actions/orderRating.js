import { makeFormErrors } from '@open-tender/js'
import { pending, fulfill, reject } from '../utils'
import {
  RESET_ORDER_RATING,
  FETCH_ORDER_RATING,
  UPDATE_ORDER_RATING,
  UNSUBSCRIBE_ORDER_RATING,
} from '../reducers/orderRating'

// action creators

export const resetOrderRating = () => ({ type: RESET_ORDER_RATING })

// async action creators

export const fetchOrderRating = ratingUuid => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(FETCH_ORDER_RATING))
  try {
    const response = await api.getOrderRating(ratingUuid)
    dispatch(fulfill(FETCH_ORDER_RATING, response))
  } catch (err) {
    dispatch(reject(FETCH_ORDER_RATING, err))
  }
}

export const updateOrderRating = (orderId, data) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(UPDATE_ORDER_RATING))
  try {
    const response = await api.putOrderRating(orderId, data)
    dispatch(fulfill(UPDATE_ORDER_RATING, response))
  } catch (err) {
    const errors = makeFormErrors(err)
    dispatch(reject(UPDATE_ORDER_RATING, errors))
  }
}

export const unsubscribeOrderRating = ratingUuid => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(UNSUBSCRIBE_ORDER_RATING))
  try {
    await api.postOrderRatingUnsubscribe(ratingUuid)
    dispatch(fulfill(UNSUBSCRIBE_ORDER_RATING))
  } catch (err) {
    dispatch(reject(UNSUBSCRIBE_ORDER_RATING, err))
  }
}
