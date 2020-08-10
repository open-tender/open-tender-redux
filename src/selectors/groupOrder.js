import { isoToDate } from '@open-tender/js'
import { selectTimezone } from './order'

export const selectGroupOrder = state => state.data.groupOrder
export const selectGroupOrderToken = state => state.data.groupOrder.token
export const selectSpendingLimit = state => {
  const { cartGuest, spendingLimit } = state.data.groupOrder
  return cartGuest && spendingLimit ? parseFloat(spendingLimit) : null
}
export const selectGroupOrderClosed = state => {
  const { cartGuest, cutoffAt, closed } = state.data.groupOrder
  const tz = selectTimezone(state)
  const cutoffDate = cutoffAt ? isoToDate(cutoffAt, tz) : null
  const pastCutoff = cutoffDate ? new Date() > cutoffDate : false
  return cartGuest && (closed || pastCutoff)
}

export const selectGroupOrderTests = state => {
  const { closed, cutoffAt, guestLimit, guestCount } = state.data.groupOrder
  const tz = selectTimezone(state)
  const cutoffDate = cutoffAt ? isoToDate(cutoffAt, tz) : null
  const pastCutoff = cutoffDate ? new Date() > cutoffDate : false
  const spotsRemaining = guestLimit ? guestLimit - guestCount : null
  const atCapacity = spotsRemaining !== null && spotsRemaining <= 0
  return { closed, pastCutoff, atCapacity }
}
