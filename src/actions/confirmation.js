import {
  RESET_CONFIRMATION,
  SET_CONFIRMATION_ORDER,
} from '../reducers/confirmation'

// action creators

export const resetConfirmation = () => ({ type: RESET_CONFIRMATION })
export const setConfirmationOrder = order => ({
  type: SET_CONFIRMATION_ORDER,
  payload: order,
})
