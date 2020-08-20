import { pending, fulfill, reject } from '../utils'
import {
  RESET_LEVELUP_CUSTOMER,
  FETCH_LEVELUP_CUSTOMER,
} from '../reducers/levelup'
import { LOGIN_CUSTOMER } from '../reducers/customer/account'
import { fetchCustomer } from './customer/account'

export const resetLevelUpCustomer = () => ({ type: RESET_LEVELUP_CUSTOMER })

export const fetchLevelUpCustomer = (token, callback) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(FETCH_LEVELUP_CUSTOMER))
  try {
    const auth = await api.postLevelUp({ token })
    dispatch(fulfill(LOGIN_CUSTOMER, auth))
    dispatch(fetchCustomer())
    dispatch(fulfill(FETCH_LEVELUP_CUSTOMER))
    if (callback) callback()
  } catch (err) {
    dispatch(reject(FETCH_LEVELUP_CUSTOMER, err))
  }
}
