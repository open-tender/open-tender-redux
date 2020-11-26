import { pending, fulfill, reject, MISSING_CUSTOMER } from '../../utils'
import {
  RESET_CUSTOMER_THANX,
  FETCH_CUSTOMER_THANX,
} from '../../reducers/customer/thanx'
import { selectToken } from '../../selectors/customer'

// action creators

export const resetCustomerThanx = () => ({ type: RESET_CUSTOMER_THANX })

// async action creators

export const fetchCustomerThanx = () => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token) return dispatch(reject(FETCH_CUSTOMER_THANX, MISSING_CUSTOMER))
  dispatch(pending(FETCH_CUSTOMER_THANX))
  try {
    const resp = await api.getCustomerThanx(token)
    dispatch(fulfill(FETCH_CUSTOMER_THANX, resp))
  } catch (err) {
    dispatch(reject(FETCH_CUSTOMER_THANX, err))
  }
}
