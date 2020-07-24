import {
  rehydrateCart,
  rehydrateCheckoutForm,
  makeFirstRequestedAt,
  makeFirstTimes,
} from '@open-tender/js'
import { pending, fulfill, reject } from '../utils'
import {
  RESET_ORDER,
  RESET_ORDER_TYPE,
  RESET_REVENUE_CENTER,
  RESET_MESSAGES,
  RESET_ALERT,
  SET_ORDER_TYPE,
  SET_SERVICE_TYPE,
  SET_ORDER_SERVICE_TYPE,
  SET_MENU_VARS,
  SET_REVENUE_CENTER,
  SET_ADDRESS,
  SET_REQUESTED_AT,
  SET_CART,
  SET_CURRENT_ITEM,
  SET_ALERT,
  ADD_MESSAGE,
  REMOVE_MESSAGE,
  ADD_ITEM,
  REMOVE_ITEM,
  INCREMENT_ITEM,
  DECREMENT_ITEM,
  FETCH_REVENUE_CENTER,
  REVERT_MENU,
  REFRESH_REVENUE_CENTER,
  EDIT_ORDER,
  REORDER,
} from '../reducers/order'
import { setMenuItems } from './menuItems'
import { updateForm } from './checkout'
import { resetMenuVars } from './menu'

// action creators

export const resetOrder = () => ({ type: RESET_ORDER })
export const resetOrderType = () => ({ type: RESET_ORDER_TYPE })
export const resetRevenueCenter = () => ({ type: RESET_REVENUE_CENTER })
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
export const setMenuVars = (revenueCenter, serviceType, requestedAt) => ({
  type: SET_MENU_VARS,
  payload: { revenueCenter, serviceType, requestedAt },
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
export const removeMessage = id => ({
  type: REMOVE_MESSAGE,
  payload: id,
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
    const revenueCenter = await api.getRevenueCenter(revenueCenterId)
    dispatch(setRevenueCenter(revenueCenter))
    dispatch(fulfill(FETCH_REVENUE_CENTER, revenueCenter))
  } catch (err) {
    dispatch(reject(FETCH_REVENUE_CENTER, err))
  }
}

export const revertMenu = ({
  revenueCenterId,
  serviceType,
  requestedAt,
}) => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(REVERT_MENU))
  try {
    const revenueCenter = await api.getRevenueCenter(revenueCenterId)
    console.log(revenueCenter, serviceType, requestedAt)
    dispatch(setMenuVars(revenueCenter, serviceType, requestedAt))
    dispatch(fulfill(REVERT_MENU, revenueCenter))
  } catch (err) {
    dispatch(reject(REVERT_MENU, err))
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
  const alert = { type: 'working', args: { text: 'Building your order...' } }
  dispatch(setAlert(alert))
  dispatch(pending(EDIT_ORDER))
  try {
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
    dispatch(updateForm(form))
    // dispatch(toggleSidebar())
    const isOutpost = revenueCenter.is_outpost
    const payload = {
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
    dispatch(fulfill(EDIT_ORDER, payload))
    dispatch(setAlert({ type: 'closeAndSidebar' }))
    // dispatch(setAlert({ type: 'sidebar' }))
  } catch (err) {
    dispatch(addMessage('Something went wrong. Please contact support.'))
    dispatch(reject(EDIT_ORDER, null))
  }
  dispatch(resetAlert())
}

export const reorderPastOrder = ({
  revenueCenterId,
  serviceType,
  items,
}) => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  const alert = { type: 'working', args: { text: 'Building your order...' } }
  dispatch(setAlert(alert))
  dispatch(pending(REORDER))
  try {
    const revenueCenter = await api.getRevenueCenter(revenueCenterId)
    const requestedAt = makeFirstRequestedAt(revenueCenter, serviceType)
    if (!requestedAt) {
      const { status } = revenueCenter
      const alert = { type: 'closed', args: { status, isCancel: true } }
      dispatch(setAlert(alert))
      dispatch(fulfill(REORDER, {}))
    } else {
      dispatch(resetMenuVars())
      dispatch(resetRevenueCenter())
      const menuItems = await api.getMenuItems(revenueCenterId, serviceType)
      const { cart, cartCounts } = rehydrateCart(menuItems, items)
      dispatch(setMenuItems(menuItems))
      const payload = {
        revenueCenter,
        requestedAt,
        serviceType,
        cart,
        cartCounts,
      }
      dispatch(fulfill(REORDER, payload))
      const alert = {
        type: 'requestedAt',
        args: { openSidebar: true },
      }
      dispatch(setAlert(alert))
    }
  } catch (err) {
    dispatch(resetAlert())
    dispatch(addMessage('Something went wrong. Please contact support.'))
    dispatch(reject(REORDER, null))
  }
}
