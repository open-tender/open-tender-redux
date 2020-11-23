const initState = {
  success: false,
  loading: 'idle',
  error: null,
  donation: null,
}

const NAME = 'donations'

export const RESET_DONATION = `${NAME}/resetDonation`
export const PURCHASE_DONATION = `${NAME}/purchaseDonation`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_DONATION:
      return { ...initState }
    case `${PURCHASE_DONATION}/pending`:
      return { ...state, loading: 'pending' }
    case `${PURCHASE_DONATION}/fulfilled`:
      return {
        ...initState,
        success: true,
        error: null,
        donation: action.payload,
      }
    case `${PURCHASE_DONATION}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    default:
      return state
  }
}
