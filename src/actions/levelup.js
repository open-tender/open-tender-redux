import { pending, fulfill, reject } from '../utils'
import {
  RESET_LEVELUP_CUSTOMER,
  FETCH_LEVELUP_CUSTOMER,
} from '../reducers/levelup'
import { loginCustomer } from './customer/account'

export const resetLevelUpCustomer = () => ({ type: RESET_LEVELUP_CUSTOMER })

export const fetchLevelUpCustomer = (token, callback) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(FETCH_LEVELUP_CUSTOMER))
  try {
    const { email } = await api.postLevelUp({ token })
    dispatch(loginCustomer(email, 'password'))
    dispatch(fulfill(FETCH_LEVELUP_CUSTOMER))
    if (callback) callback()
  } catch (err) {
    dispatch(reject(FETCH_LEVELUP_CUSTOMER, err))
  }
}
