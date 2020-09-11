import { ADD_ALERT, DISMISS_ALERT } from '../reducers/alerts'

// action creators

export const addAlert = message => ({
  type: ADD_ALERT,
  payload: message,
})
export const dismissAlert = id => ({ type: DISMISS_ALERT, payload: id })
