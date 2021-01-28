import { makeFormErrors } from '@open-tender/js'
import { pending, fulfill, reject, MISSING_CUSTOMER } from '../../utils'
import { name, entity } from '../../reducers/customer/creditCards'
import { selectToken } from '../../selectors/customer'
import { showNotification } from '../notifications'
import { checkAuth } from './account'

// action creators

export const resetCustomerCreditCards = () => ({
  type: `${name}/reset${entity}`,
})
export const resetCustomerCreditCardsError = () => ({
  type: `${name}/reset${entity}Error`,
})
export const setCustomerCreditCards = creditCards => ({
  type: `${name}/set${entity}`,
  payload: creditCards,
})

// async action creators

export const fetchCustomerCreditCards = includeLinked => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token)
    return dispatch(reject(`${name}/fetch${entity}`, MISSING_CUSTOMER))
  dispatch(pending(`${name}/fetch${entity}`))
  try {
    const creditCards = await api.getCustomerCreditCards(token, includeLinked)
    dispatch(fulfill(`${name}/fetch${entity}`, creditCards))
  } catch (err) {
    dispatch(checkAuth(err, () => reject(`${name}/fetch${entity}`, err)))
  }
}

export const updateCustomerCreditCard = (cardId, data, callback) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token)
    return dispatch(reject(`${name}/update${entity}`, MISSING_CUSTOMER))
  dispatch(pending(`${name}/update${entity}`))
  try {
    await api.putCustomerCreditCard(token, cardId, data)
    const includeLinked = true
    const creditCards = await api.getCustomerCreditCards(token, includeLinked)
    dispatch(fulfill(`${name}/update${entity}`, creditCards))
    dispatch(showNotification('Credit card updated!'))
    if (callback) callback()
  } catch (err) {
    const errors = makeFormErrors(err)
    dispatch(checkAuth(err, () => reject(`${name}/update${entity}`, errors)))
  }
}

export const removeCustomerCreditCard = (cardId, callback) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token)
    return dispatch(reject(`${name}/remove${entity}`, MISSING_CUSTOMER))
  dispatch(pending(`${name}/remove${entity}`))
  try {
    await api.deleteCustomerCreditCard(token, cardId)
    const includeLinked = true
    const creditCards = await api.getCustomerCreditCards(token, includeLinked)
    dispatch(fulfill(`${name}/remove${entity}`, creditCards))
    dispatch(showNotification('Credit card removed!'))
    if (callback) callback()
  } catch (err) {
    dispatch(checkAuth(err, () => reject(`${name}/remove${entity}`, err)))
  }
}

export const addCustomerCreditCard = (data, callback) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token) return dispatch(reject(`${name}/add${entity}`, MISSING_CUSTOMER))
  dispatch(pending(`${name}/add${entity}`))
  try {
    await api.postCustomerCreditCard(token, data)
    const includeLinked = true
    const creditCards = await api.getCustomerCreditCards(token, includeLinked)
    dispatch(fulfill(`${name}/add${entity}`, creditCards))
    dispatch(showNotification('Credit card added!'))
    if (callback) callback()
  } catch (err) {
    const errors = makeFormErrors(err)
    dispatch(checkAuth(err, () => reject(`${name}/add${entity}`, errors)))
  }
}
