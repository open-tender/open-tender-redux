import { pending, fulfill, reject, MISSING_CUSTOMER } from '../../utils'
import { name, entity } from '../../reducers/customer/giftCards'
import { selectToken } from '../../selectors/customer'

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
