import { pending, fulfill, reject, MISSING_CUSTOMER } from '../../utils'
import {
  RESET_CUSTOMER_FCM_TOKEN,
  FETCH_CUSTOMER_FCM_TOKEN,
  ADD_CUSTOMER_FCM_TOKEN,
  REMOVE_CUSTOMER_FCM_TOKEN,
} from '../../reducers/customer/fcmToken'
import { selectToken } from '../../selectors/customer'
import { checkAuth } from './account'

// action creators

export const resetCustomerFcmToken = () => ({ type: RESET_CUSTOMER_FCM_TOKEN })

// async action creators

export const addCustomerFcmToken =
  (fcmToken, callback) => async (dispatch, getState) => {
    const { api } = getState().config
    if (!api) return
    const token = selectToken(getState())
    if (!token)
      return dispatch(reject(ADD_CUSTOMER_FCM_TOKEN, MISSING_CUSTOMER))
    dispatch(pending(ADD_CUSTOMER_FCM_TOKEN))
    try {
      await api.postCustomerFcmToken(token, fcmToken)
      dispatch(fulfill(ADD_CUSTOMER_FCM_TOKEN))
      if (callback) callback()
    } catch (err) {
      dispatch(checkAuth(err, () => reject(FETCH_CUSTOMER_FCM_TOKEN, err)))
    }
  }

export const fetchCustomerFcmTokens = () => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token)
    return dispatch(reject(FETCH_CUSTOMER_FCM_TOKEN, MISSING_CUSTOMER))
  dispatch(pending(FETCH_CUSTOMER_FCM_TOKEN))
  try {
    await api.getCustomerFcmToken(token)
    dispatch(fulfill(FETCH_CUSTOMER_FCM_TOKEN))
  } catch (err) {
    dispatch(checkAuth(err, () => reject(FETCH_CUSTOMER_FCM_TOKEN, err)))
  }
}

export const removeCustomerFcmTokens =
  callback => async (dispatch, getState) => {
    const { api } = getState().config
    if (!api) return
    const token = selectToken(getState())
    if (!token)
      return dispatch(reject(REMOVE_CUSTOMER_FCM_TOKEN, MISSING_CUSTOMER))
    dispatch(pending(REMOVE_CUSTOMER_FCM_TOKEN))
    try {
      await api.deleteCustomerFcmToken(token)
      dispatch(fulfill(REMOVE_CUSTOMER_FCM_TOKEN))
      if (callback) callback()
    } catch (err) {
      dispatch(checkAuth(err, () => reject(REMOVE_CUSTOMER_FCM_TOKEN, err)))
    }
  }
