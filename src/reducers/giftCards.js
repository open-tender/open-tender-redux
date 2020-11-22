const initState = {
  success: false,
  loading: 'idle',
  error: null,
  giftCards: null,
}

const NAME = 'giftCards'

export const RESET_GIFT_CARDS = `${NAME}/resetGiftCards`
export const PURCHASE_GIFT_CARDS = `${NAME}/purchaseGiftCards`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_GIFT_CARDS:
      return { ...initState }
    case `${PURCHASE_GIFT_CARDS}/pending`:
      return { ...state, loading: 'pending' }
    case `${PURCHASE_GIFT_CARDS}/fulfilled`:
      return {
        ...initState,
        success: true,
        error: null,
        giftCards: action.payload,
      }
    case `${PURCHASE_GIFT_CARDS}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    default:
      return state
  }
}
