import { makeFormErrors } from '@open-tender/js'
import { pending, fulfill, reject } from '../utils'
import { RESET_DONATION, PURCHASE_DONATION } from '../reducers/donations'

export const resetDonation = () => ({ type: RESET_DONATION })

export const purchaseDonation = (data, callback) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(PURCHASE_DONATION))
  try {
    const donation = await api.postPurchaseDonation(data)
    dispatch(fulfill(PURCHASE_DONATION, donation))
    if (callback) callback()
  } catch (err) {
    const errors = makeFormErrors(err)
    dispatch(reject(PURCHASE_DONATION, errors))
  }
}
