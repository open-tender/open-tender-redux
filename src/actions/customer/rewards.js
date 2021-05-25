import { pending, fulfill, reject, MISSING_CUSTOMER } from '../../utils'
import { name, entity } from '../../reducers/customer/rewards'
import { selectToken } from '../../selectors/customer'
import { checkAuth } from './account'

// action creators

export const resetCustomerRewards = () => ({
  type: `${name}/reset${entity}`,
})
export const resetCustomerRewardsError = () => ({
  type: `${name}/reset${entity}Error`,
})
export const setCustomerRewards = rewards => ({
  type: `${name}/set${entity}`,
  payload: rewards,
})

// async action creators

export const fetchCustomerRewards = () => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token)
    return dispatch(reject(`${name}/fetch${entity}`, MISSING_CUSTOMER))
  dispatch(pending(`${name}/fetch${entity}`))
  try {
    const rewards = await api.getCustomerRewards(token)
    dispatch(fulfill(`${name}/fetch${entity}`, rewards))
  } catch (err) {
    dispatch(checkAuth(err, () => reject(`${name}/fetch${entity}`, err)))
  }
}
