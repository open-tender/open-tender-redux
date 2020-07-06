import { pending, fulfill, reject, MISSING_CUSTOMER } from '../../utils'
import { name, entity } from '../../reducers/customer/allergens'
import { selectToken } from '../../selectors/customer'
import { showNotification } from '../notifications'
import { setSelectedAllergens } from '../allergens'

// action creators

export const resetCustomerAllergens = () => ({ type: `${name}/reset${entity}` })
export const setCustomerAllergens = allergens => ({
  type: `${name}/set${entity}`,
  payload: allergens,
})

// async action creators

export const fetchCustomerAllergens = () => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token)
    return dispatch(reject(`${name}/fetch${entity}`, MISSING_CUSTOMER))
  dispatch(pending(`${name}/fetch${entity}`))
  try {
    const allergens = await api.getCustomerAllergens(token)
    dispatch(fulfill(`${name}/fetch${entity}`, allergens))
  } catch (err) {
    dispatch(reject(`${name}/fetch${entity}`, err))
  }
}

export const updateCustomerAllergens = data => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token)
    return dispatch(reject(`${name}/update${entity}`, MISSING_CUSTOMER))
  dispatch(pending(`${name}/update${entity}`))
  try {
    const allergens = await api.putCustomerAllergens(token, data)
    dispatch(fulfill(`${name}/update${entity}`, allergens))
    dispatch(setSelectedAllergens(allergens || []))
    dispatch(showNotification('Allergens updated!'))
  } catch (err) {
    dispatch(reject(`${name}/update${entity}`, err))
  }
}
