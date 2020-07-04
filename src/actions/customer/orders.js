import { pending, fulfill, reject, MISSING_CUSTOMER } from '../../utils'
import { name, entity } from '../../reducers/customer/orders'
import { selectToken } from '../../selectors/customer'

// action creators

export const resetCustomerOrders = () => ({ type: `${name}/reset${entity}` })
export const resetCustomerOrdersError = () => ({
  type: `${name}/reset${entity}Error`,
})
export const setCustomerOrders = orders => ({
  type: `${name}/set${entity}`,
  payload: orders,
})

// async action creators

export const fetchCustomerOrders = limit => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token)
    return dispatch(reject(`${name}/fetch${entity}`, MISSING_CUSTOMER))
  dispatch(pending(`${name}/fetch${entity}`))
  try {
    const { data: orders } = await api.getCustomerOrders(token, limit)
    dispatch(fulfill(`${name}/fetch${entity}`, orders))
  } catch (err) {
    dispatch(reject(`${name}/fetch${entity}`, err))
  }
}
