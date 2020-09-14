import {
  isoToDate,
  timezoneMap,
  currentLocalDate,
  notDone,
} from '@open-tender/js'

export const selectOrders = state => {
  const { entities: orders, loading, error } = state.data.orders
  return { orders, loading, error }
}

export const selectCurrentOrder = state => {
  return state.data.orders.currentOrder
}

export const selectCurrentOrders = state => {
  const { entities, loading, error } = state.data.orders
  const orders = entities.filter(i => {
    const tz = timezoneMap[i.timezone]
    const fireDate = isoToDate(i.fire_at, tz)
    const currentDate = currentLocalDate(tz)
    return notDone(i.prep_status) && fireDate < currentDate
  })
  return { orders, loading, error }
}

export const selectFutureOrders = state => {
  const { entities, loading, error } = state.data.orders
  const orders = entities.filter(i => {
    const tz = timezoneMap[i.timezone]
    const fireDate = isoToDate(i.fire_at, tz)
    const currentDate = currentLocalDate(tz)
    return notDone(i.prep_status) && fireDate > currentDate
  })
  return { orders, loading, error }
}

export const selectOrdersCounts = state => {
  const { current, future, qa } = state.data.orders.counts
  return { current, future, qa }
}
