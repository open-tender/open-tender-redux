import { pending, fulfill, reject, MISSING_CUSTOMER } from '../../utils'
import { name, entity } from '../../reducers/customer/allergens'
import { selectToken } from '../../selectors/customer'

// action creators

export const resetCustomerAllergens = () => ({ type: `${name}/reset${entity}` })
export const setCustomerAllergens = allergens => ({
  type: `${name}/set${entity}`,
  payload: allergens,
})

// async action creators

const FETCH_CUSTOMER_ALLERGENS = `${name}/fetch${entity}`

export const fetchCustomerAllergens = () => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token)
    return dispatch(reject(FETCH_CUSTOMER_ALLERGENS, MISSING_CUSTOMER))
  dispatch(pending(FETCH_CUSTOMER_ALLERGENS))
  try {
    const allergens = await api.getCustomerAllergens(token)
    dispatch(fulfill(FETCH_CUSTOMER_ALLERGENS, allergens))
  } catch (err) {
    dispatch(reject(FETCH_CUSTOMER_ALLERGENS, err))
  }
}
