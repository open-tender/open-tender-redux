import { makeFormErrors } from '@open-tender/js'
import { pending, fulfill, reject, MISSING_CUSTOMER } from '../../utils'
import { name, entity } from '../../reducers/customer/giftCards'
import { selectToken } from '../../selectors/customer'
import { showNotification } from '../notifications'

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
    dispatch(reject(`${name}/fetch${entity}`, err))
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
    dispatch(reject(`${name}/update${entity}`, makeFormErrors(err)))
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
    dispatch(reject(`${name}/remove${entity}`, err))
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
    dispatch(reject(`${name}/update${entity}`, makeFormErrors(err)))
  }
}
