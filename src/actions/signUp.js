import { makeFormErrors } from '@open-tender/js'
import { pending, fulfill, reject } from '../utils'
import { RESET_SIGN_UP, SIGN_UP } from '../reducers/signUp'
import { loginCustomer } from './customer/account'

export const resetSignUp = () => ({ type: RESET_SIGN_UP })

export const signUpCustomer = (data, callback) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(SIGN_UP))
  try {
    await api.postSignUp(data)
    dispatch(loginCustomer(data.email, data.password))
    dispatch(fulfill(SIGN_UP))
    if (callback) callback()
  } catch (err) {
    const errors = makeFormErrors(err)
    dispatch(reject(SIGN_UP, errors))
  }
}
