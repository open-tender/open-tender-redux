import {
  isoToDate,
  timezoneMap,
  currentLocalDate,
  prepStatus,
} from '@open-tender/js'

const notDone = prep_status => {
  const notDoneStates = [prepStatus.TODO, prepStatus.IN_PROGRESS]
  return notDoneStates.includes(prep_status)
}

export const selectOrders = state => {
  const { entities: orders, loading, error } = state.data.orders
  return { orders, loading, error }
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
