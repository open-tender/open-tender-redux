import { RESET_ALERTS, ADD_ALERT, DISMISS_ALERT } from '../reducers/alerts'

// action creators

export const clearAlerts = () => ({ type: RESET_ALERTS })
export const addAlert = message => ({
  type: ADD_ALERT,
  payload: message,
})
export const dismissAlert = id => ({ type: DISMISS_ALERT, payload: id })
