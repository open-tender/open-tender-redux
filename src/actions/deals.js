import { pending, fulfill, reject } from '../utils'
import { RESET_DEALS, SET_SELECTED_DEALS, FETCH_DEALS } from '../reducers/deals'

// action creators

export const resetDeals = () => ({ type: RESET_DEALS })
export const setSelectedDeals = deals => ({
  type: SET_SELECTED_DEALS,
  payload: deals,
})

// async action creators

export const fetchDeals = () => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(FETCH_DEALS))
  try {
    const { profile } = getState().data.customer.account
    const { customer_id = null } = profile || {}
    const deals = await api.getDeals(customer_id)
    dispatch(fulfill(FETCH_DEALS, deals))
  } catch (err) {
    dispatch(reject(FETCH_DEALS, err))
  }
}
