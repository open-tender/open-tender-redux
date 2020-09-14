import { pending, fulfill, reject } from '../utils'
import {
  RESET_ORDERS_SEARCH,
  FETCH_ORDERS_SEARCH,
} from '../reducers/ordersSearch'

// action creators

export const resetOrdersSearch = () => ({ type: RESET_ORDERS_SEARCH })

// async action creators

export const fetchOrdersSearch = search => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(FETCH_ORDERS_SEARCH))
  try {
    const orders = await api.getOrders({ search })
    dispatch(fulfill(FETCH_ORDERS_SEARCH, orders))
  } catch (err) {
    dispatch(reject(FETCH_ORDERS_SEARCH, err))
  }
}
