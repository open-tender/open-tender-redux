import { pending, fulfill, reject, MISSING_CUSTOMER } from '../../utils'
import { name, entity } from '../../reducers/customer/loyalty'
import { selectToken } from '../../selectors/customer'
import { checkAuth } from './account'
import { fetchCustomerThanx } from './thanx'
import { fetchCustomerLevelUp } from './levelup'

// action creators

export const resetCustomerLoyalty = () => ({
  type: `${name}/reset${entity}`,
})
export const resetCustomerLoyaltyError = () => ({
  type: `${name}/reset${entity}Error`,
})
export const setCustomerLoyalty = loyalty => ({
  type: `${name}/set${entity}`,
  payload: loyalty,
})

// async action creators

export const fetchCustomerLoyalty = () => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token)
    return dispatch(reject(`${name}/fetch${entity}`, MISSING_CUSTOMER))
  dispatch(pending(`${name}/fetch${entity}`))
  try {
    const loyalty = await api.getCustomerLoyalty(token)
    dispatch(fulfill(`${name}/fetch${entity}`, loyalty))
  } catch (err) {
    dispatch(checkAuth(err, () => reject(`${name}/fetch${entity}`, err)))
  }
}

export const fetchCustomerRewards = () => async (dispatch, getState) => {
  const { brand } = getState().config
  if (brand.has_rewards) {
    dispatch(fetchCustomerLoyalty())
  } else if (brand.has_thanx) {
    dispatch(fetchCustomerThanx())
  } else if (brand.has_levelup) {
    dispatch(fetchCustomerLevelUp())
  }
}
