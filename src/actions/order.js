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
import {
  RESET_ORDER,
  RESET_ORDER_TYPE,
  SET_ORDER_TYPE,
  SET_SERVICE_TYPE,
  SET_ORDER_SERVICE_TYPE,
  SET_REVENUE_CENTER,
} from '../reducers/order'

// actions

export const resetOrder = () => ({ type: RESET_ORDER })
export const resetOrderType = () => ({ type: RESET_ORDER_TYPE })
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
export const setRevenueCenter = revenueCenter => ({
  type: SET_REVENUE_CENTER,
  payload: revenueCenter,
})

// selectors

export const selectOrder = state => state.data.order
export const selectOrderType = state => state.data.order.orderType
export const selectOrderTypeName = state =>
  orderTypeNamesMap[state.data.order.orderType]

export const selectServiceType = state => state.data.order.serviceType
export const selectServiceTypeName = state =>
  serviceTypeNamesMap[state.data.order.serviceType]

export const selectAutoSelect = state => {
  const rcConfig = state.config.content.revenueCenters
  const { orderType, serviceType } = state.data.order
  return orderType && serviceType
    ? rcConfig.autoSelect[orderType][serviceType]
    : false
}

export const selectRequestedAt = state =>
  state.data.order.requestedAt === 'asap'
    ? 'ASAP'
    : state.data.order.requestedAt

export const selectRevenueCenter = state => state.data.order.revenueCenter
// TODO: need to replace this
export const selectRevenueCenterName = state =>
  state.data.order.revenueCenter ? state.data.order.revenueCenter.name : null
export const selectTimezone = state => {
  return state.data.order.revenueCenter
    ? timezoneMap[state.data.order.revenueCenter.timezone]
    : getUserTimezone()
}
export const selectOrderLimits = state => {
  const { revenueCenter, serviceType } = state.data.order
  if (!revenueCenter || !serviceType) {
    return { orderMinimum: null, orderMaximum: null }
  }
  const { order_maximum, order_minimum } = revenueCenter.settings
  let orderMaximum = parseFloat(order_maximum[serviceType])
  let orderMinimum = parseFloat(order_minimum[serviceType])
  return {
    orderMinimum: orderMinimum > 0 ? orderMinimum : null,
    orderMaximum: orderMaximum > 0 ? orderMaximum : null,
  }
}

export const selectAddress = state => state.data.order.address

const makeMenuSlug = revenueCenter => {
  if (!revenueCenter) return '/'
  const { slug, revenue_center_type } = revenueCenter
  return `/menu/${slug}-${revenue_center_type.toLowerCase()}`
}
export const selectMenuSlug = state =>
  makeMenuSlug(state.data.order.revenueCenter)

export const selectMenuVars = state => {
  if (!state.data.order.revenueCenter) return {}
  return {
    revenueCenterId: state.data.order.revenueCenter.revenue_center_id,
    serviceType: state.data.order.serviceType,
    requestedAt: state.data.order.requestedAt,
  }
}
export const selectCurrentItem = state => state.data.order.currentItem
export const selectCart = state => state.data.order.cart
export const selectCartQuantity = state => {
  return state.data.order.cart
    ? state.data.order.cart.reduce((t, i) => (t += i.quantity), 0)
    : 0
}
export const selectCartTotal = state => {
  return state.data.order.cart
    ? state.data.order.cart.reduce((t, i) => (t += i.totalPrice), 0.0)
    : 0.0
}
export const selectCartCounts = state => state.data.order.cartCounts || {}

export const selectCanOrder = state =>
  state.data.order.revenueCenter &&
  state.data.order.serviceType &&
  state.data.order.requestedAt

export const selectMessages = state => state.data.order.messages
