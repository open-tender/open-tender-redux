import { pending, fulfill, reject, MISSING_CUSTOMER } from '../../utils'
import { name, entity } from '../../reducers/customer/houseAccounts'
import { selectToken } from '../../selectors/customer'
import { checkAuth } from './account'

// action creators

export const resetCustomerHouseAccounts = () => ({
  type: `${name}/reset${entity}`,
})
export const resetCustomerHouseAccountsError = () => ({
  type: `${name}/reset${entity}Error`,
})
export const setCustomerHouseAccounts = houseAccounts => ({
  type: `${name}/set${entity}`,
  payload: houseAccounts,
})

// async action creators

export const fetchCustomerHouseAccounts = () => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token)
    return dispatch(reject(`${name}/fetch${entity}`, MISSING_CUSTOMER))
  dispatch(pending(`${name}/fetch${entity}`))
  try {
    const houseAccounts = await api.getCustomerHouseAccounts(token)
    dispatch(fulfill(`${name}/fetch${entity}`, houseAccounts))
  } catch (err) {
    dispatch(checkAuth(err, () => reject(`${name}/fetch${entity}`, err)))
  }
}
