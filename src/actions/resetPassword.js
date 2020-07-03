import { makeFormErrors } from 'open-tender-js'
import { pending, fulfill, reject } from '../utils'
import {
  RESET_PASSWORD_RESET,
  SEND_PASSWORD_RESET,
  RESET_PASSWORD,
} from '../reducers/resetPassword'

export const resetPasswordReset = () => ({ type: RESET_PASSWORD_RESET })

export const sendPasswordResetEmail = (email, link_url) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(SEND_PASSWORD_RESET))
  try {
    await api.postSendPasswordResetEmail(email, link_url)
    dispatch(fulfill(SEND_PASSWORD_RESET))
  } catch (err) {
    const errors = makeFormErrors(err)
    const error = errors.email || errors.form
    dispatch(reject(SEND_PASSWORD_RESET, error))
  }
}

export const resetPassword = (new_password, token) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(RESET_PASSWORD))
  try {
    await api.postResetPassword(new_password, token)
    dispatch(fulfill(RESET_PASSWORD))
  } catch (err) {
    const errors = makeFormErrors(err)
    dispatch(reject(RESET_PASSWORD, errors))
  }
}
