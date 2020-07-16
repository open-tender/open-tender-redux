import {
  orderTypeNamesMap,
  serviceTypeNamesMap,
  timezoneMap,
  getUserTimezone,
} from '@open-tender/js'

export const selectOrder = state => state.data.order
export const selectAlert = state => state.data.order.alert
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

export const selectMenuSlug = state => {
  const { revenueCenter } = state.data.order
  return revenueCenter ? `/menu/${revenueCenter.slug}` : '/'
}

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
