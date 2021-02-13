import { pending, fulfill, reject, MISSING_CUSTOMER } from '../../utils'
import {
  RESET_CUSTOMER_QRCODE,
  FETCH_CUSTOMER_QRCODE,
} from '../../reducers/customer/qrcode'
import { selectToken } from '../../selectors/customer'
import { checkAuth } from './account'

// action creators

export const resetCustomerQRCode = () => ({ type: RESET_CUSTOMER_QRCODE })

// async action creators

export const fetchCustomerQRCode = () => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token) return dispatch(reject(FETCH_CUSTOMER_QRCODE, MISSING_CUSTOMER))
  dispatch(pending(FETCH_CUSTOMER_QRCODE))
  try {
    const { qr_code_url } = await api.getCustomerQRCode(token)
    dispatch(fulfill(FETCH_CUSTOMER_QRCODE, qr_code_url))
  } catch (err) {
    dispatch(checkAuth(err, () => reject(FETCH_CUSTOMER_QRCODE, err)))
  }
}
