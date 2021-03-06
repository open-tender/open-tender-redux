import { makeFormErrors } from '@open-tender/js'
import { pending, fulfill, reject, MISSING_CUSTOMER } from '../../utils'
import { name, entity } from '../../reducers/customer/giftCards'
import { selectToken } from '../../selectors/customer'
import { showNotification } from '../notifications'
import { checkAuth } from './account'

// action creators

export const resetCustomerGiftCards = () => ({
  type: `${name}/reset${entity}`,
})
export const resetCustomerGiftCardsError = () => ({
  type: `${name}/reset${entity}Error`,
})
export const setCustomerGiftCards = giftCards => ({
  type: `${name}/set${entity}`,
  payload: giftCards,
})

// async action creators

export const fetchCustomerGiftCards = () => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token)
    return dispatch(reject(`${name}/fetch${entity}`, MISSING_CUSTOMER))
  dispatch(pending(`${name}/fetch${entity}`))
  try {
    const giftCards = await api.getCustomerGiftCards(token)
    dispatch(fulfill(`${name}/fetch${entity}`, giftCards))
  } catch (err) {
    dispatch(checkAuth(err, () => reject(`${name}/fetch${entity}`, err)))
  }
}

export const updateCustomerGiftCard = (giftCardId, data, callback) => async (
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
    await api.putCustomerGiftCard(token, giftCardId, data)
    const giftCards = await api.getCustomerGiftCards(token)
    dispatch(fulfill(`${name}/update${entity}`, giftCards))
    dispatch(showNotification('Gift card balance updated!'))
    if (callback) callback()
  } catch (err) {
    const errors = makeFormErrors(err)
    dispatch(checkAuth(err, () => reject(`${name}/update${entity}`, errors)))
  }
}

export const removeCustomerGiftCard = (giftCardId, callback) => async (
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
    await api.deleteCustomerGiftCard(token, giftCardId)
    const giftCards = await api.getCustomerGiftCards(token)
    dispatch(fulfill(`${name}/update${entity}`, giftCards))
    dispatch(showNotification('Gift card removed!'))
    if (callback) callback()
  } catch (err) {
    dispatch(checkAuth(err, () => reject(`${name}/remove${entity}`, err)))
  }
}

export const addCustomerGiftCard = (data, callback) => async (
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
    await api.postCustomerGiftCard(token, data)
    const giftCards = await api.getCustomerGiftCards(token)
    dispatch(fulfill(`${name}/update${entity}`, giftCards))
    dispatch(showNotification('Gift card added!'))
    if (callback) callback()
  } catch (err) {
    const errors = makeFormErrors(err)
    dispatch(checkAuth(err, () => reject(`${name}/update${entity}`, errors)))
  }
}

export const assignCustomerGiftCard = (cardNumber, callback) => async (
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
    await api.postCustomerGiftCardAssign(token, cardNumber)
    const giftCards = await api.getCustomerGiftCards(token)
    dispatch(fulfill(`${name}/update${entity}`, giftCards))
    dispatch(showNotification('Gift card added to your account!'))
    if (callback) callback()
  } catch (err) {
    const errors = makeFormErrors(err)
    dispatch(checkAuth(err, () => reject(`${name}/update${entity}`, errors)))
  }
}

export const assignCustomerGiftCardOther = (
  giftCardId,
  email,
  callback
) => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token)
    return dispatch(reject(`${name}/update${entity}`, MISSING_CUSTOMER))
  dispatch(pending(`${name}/update${entity}`))
  try {
    await api.postCustomerGiftCardAssignOther(token, giftCardId, email)
    const giftCards = await api.getCustomerGiftCards(token)
    dispatch(fulfill(`${name}/update${entity}`, giftCards))
    dispatch(showNotification(`Gift card assigned to ${email}`))
    if (callback) callback()
  } catch (err) {
    const errors = makeFormErrors(err)
    dispatch(checkAuth(err, () => reject(`${name}/update${entity}`, errors)))
  }
}
