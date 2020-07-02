import { SHOW_NOTIFICATION, HIDE_NOTIFICATION } from '../reducers/notifications'

// action creators

export const showNotification = message => ({
  type: SHOW_NOTIFICATION,
  payload: message,
})
export const hideNotification = () => ({ type: HIDE_NOTIFICATION })
