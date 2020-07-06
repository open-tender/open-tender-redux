import { pending, fulfill, reject } from '../utils'
import {
  RESET_VALID_TIMES,
  SET_VALID_TIMES,
  FETCH_VALID_TIMES,
} from '../reducers/validTimes'

// action creators

export const resetValidTimes = () => ({ type: RESET_VALID_TIMES })
export const setValidTimes = order => ({
  type: SET_VALID_TIMES,
  payload: order,
})

// async action creators

export const fetchValidTimes = orderType => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(FETCH_VALID_TIMES))
  try {
    const validTimes = await api.getValidTimes(orderType)
    dispatch(fulfill(FETCH_VALID_TIMES, validTimes))
  } catch (err) {
    dispatch(reject(FETCH_VALID_TIMES, err))
  }
}
