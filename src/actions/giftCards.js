import { makeFormErrors } from '@open-tender/js'
import { pending, fulfill, reject } from '../utils'
import { RESET_GIFT_CARDS, PURCHASE_GIFT_CARDS } from '../reducers/giftCards'

export const resetGiftCards = () => ({ type: RESET_GIFT_CARDS })

export const purchaseGiftCards = (data, callback) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(PURCHASE_GIFT_CARDS))
  try {
    const giftCards = await api.postPurchaseGiftCards(data)
    dispatch(fulfill(PURCHASE_GIFT_CARDS, giftCards))
    if (callback) callback()
  } catch (err) {
    const errors = makeFormErrors(err)
    dispatch(reject(PURCHASE_GIFT_CARDS, errors))
  }
}
