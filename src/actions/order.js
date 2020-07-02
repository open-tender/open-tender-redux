import {
  addItem,
  removeItem,
  incrementItem,
  decrementItem,
  calcCartCounts,
  rehydrateCart,
  rehydrateCheckoutForm,
  serviceTypeNamesMap,
  orderTypeNamesMap,
  timezoneMap,
  getUserTimezone,
  makeFirstRequestedAt,
  makeFirstTimes,
  makeRequestedAtStr,
  makeRandomNumberString,
} from 'open-tender-js'
import { pending, fulfill, reject } from '../utils'
import {
  RESET_ORDER,
  RESET_ORDER_TYPE,
  RESET_MESSAGES,
  RESET_ALERT,
  SET_ORDER_TYPE,
  SET_SERVICE_TYPE,
  SET_ORDER_SERVICE_TYPE,
  SET_REVENUE_CENTER,
  SET_ADDRESS,
  SET_REQUESTED_AT,
  SET_CART,
  SET_CURRENT_ITEM,
  ADD_ITEM,
  REMOVE_ITEM,
  INCREMENT_ITEM,
  DECREMENT_ITEM,
  FETCH_REVENUE_CENTER,
  REFRESH_REVENUE_CENTER,
  SET_ALERT,
  ADD_MESSAGE,
} from '../reducers/order'
import { setMenuItems } from './menuItems'

// action creators

export const resetOrder = () => ({ type: RESET_ORDER })
export const resetOrderType = () => ({ type: RESET_ORDER_TYPE })
export const resetMessages = () => ({ type: RESET_MESSAGES })
export const resetAlert = () => ({ type: RESET_ALERT })

export const setAlert = alert => ({
  type: SET_ALERT,
  payload: alert,
})
export const setOrderType = orderType => ({
  type: SET_ORDER_TYPE,
  payload: orderType,
})
export const setServiceType = serviceType => ({
  type: SET_SERVICE_TYPE,
  payload: serviceType,
})
export const setOrderServiceType = (orderType, serviceType, isOutpost) => ({
  type: SET_ORDER_SERVICE_TYPE,
  payload: { orderType, serviceType, isOutpost: isOutpost || false },
})
export const setAddress = address => ({
  type: SET_ADDRESS,
  payload: address,
})
export const setRequestedAt = requestedAt => ({
  type: SET_REQUESTED_AT,
  payload: requestedAt,
})
export const setRevenueCenter = revenueCenter => ({
  type: SET_REVENUE_CENTER,
  payload: revenueCenter,
})
export const setCart = cart => ({
  type: SET_CART,
  payload: cart,
})
export const setCurrentItem = item => ({
  type: SET_CURRENT_ITEM,
  payload: item,
})
export const addItemToCart = item => ({
  type: ADD_ITEM,
  payload: item,
})
export const removeItemFromCart = item => ({
  type: REMOVE_ITEM,
  payload: item,
})
export const incrementItemInCart = item => ({
  type: INCREMENT_ITEM,
  payload: item,
})
export const decrementItemInCart = item => ({
  type: DECREMENT_ITEM,
  payload: item,
})
export const addMessage = message => ({
  type: ADD_MESSAGE,
  payload: message,
})

// async action creators

export const fetchRevenueCenter = revenueCenterId => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(FETCH_REVENUE_CENTER))
  try {
    const revenueCenter = api.getRevenueCenter(revenueCenterId)
    dispatch(fulfill(FETCH_REVENUE_CENTER, revenueCenter))
  } catch (err) {
    dispatch(reject(FETCH_REVENUE_CENTER, err))
  }
}

export const refreshRevenueCenter = ({
  revenueCenterId,
  serviceType,
  requestedAt,
}) => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(REFRESH_REVENUE_CENTER))
  try {
    const revenueCenter = await api.getRevenueCenter(revenueCenterId)
    const firstTimes = makeFirstTimes(revenueCenter, serviceType, requestedAt)
    const { status } = revenueCenter
    let alert
    if (!firstTimes || status !== 'OPEN') {
      alert = { type: 'closed', args: { status, preventClose: true } }
    } else {
      alert = {
        type: 'adjustRequestedAt',
        args: { firstTimes, revenueCenter, preventClose: true },
      }
    }
    dispatch(fulfill(REFRESH_REVENUE_CENTER, alert))
  } catch (err) {
    dispatch(reject(REFRESH_REVENUE_CENTER, err))
  }
}

export const editOrder = order => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  try {
    const alert = { type: 'working', args: { text: 'Building your order...' } }
    dispatch(setAlert(alert))
    const {
      order_id: orderId,
      order_type: orderType,
      service_type: serviceType,
      requested_at: requestedAt,
      revenue_center,
      address,
    } = order
    const revenueCenterId = revenue_center.revenue_center_id
    const revenueCenter = await api.getRevenueCenter(revenueCenterId)
    const menuItems = await api.getMenuItems(revenueCenterId, serviceType)
    const { cart, cartCounts } = rehydrateCart(menuItems, order.cart)
    dispatch(setMenuItems(menuItems))
    const form = rehydrateCheckoutForm(order)
    // dispatch(updateForm(form))
    // dispatch(toggleSidebar())
    const isOutpost = revenueCenter.is_outpost
    return {
      orderId,
      orderType,
      serviceType,
      isOutpost,
      revenueCenter,
      requestedAt,
      address,
      cart,
      cartCounts,
    }
  } catch (err) {
    dispatch(addMessage('Something went wrong. Please contact support.'))
  }
  dispatch(resetAlert())
}
