import { pending, fulfill, reject } from '../utils'
import {
  RESET_COMPLETED_ORDERS,
  FETCH_COMPLETED_ORDERS,
} from '../reducers/completedOrders'

// action creators

export const resetCompletedOrders = () => ({ type: RESET_COMPLETED_ORDERS })

// async action creators

export const fetchCompletedOrders = (business_date, channelTypes) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(FETCH_COMPLETED_ORDERS))
  try {
    const args = { business_date, prep_status: `COMPLETED,FULFILLED` }
    if (channelTypes) args.channel_type = channelTypes
    const orders = await api.getOrders(args)
    dispatch(fulfill(FETCH_COMPLETED_ORDERS, orders))
  } catch (err) {
    dispatch(reject(FETCH_COMPLETED_ORDERS, err))
  }
}

export const refreshCompletedOrders = channelTypes => async (
  dispatch,
  getState
) => {
  const businessDate = getState().kds.businessDate
  if (!businessDate) return
  dispatch(fetchCompletedOrders(businessDate, channelTypes))
}
