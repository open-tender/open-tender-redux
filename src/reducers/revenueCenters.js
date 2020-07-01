const initState = {
  revenueCenters: [],
  loading: 'idle',
  error: null,
}

const NAME = 'revenueCenters'

export const RESET_REVENUE_CENTERS = `${NAME}/resetRevenueCenters`
export const FETCH_REVENUE_CENTERS = `${NAME}/fetchRevenueCenters`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_REVENUE_CENTERS:
      return { ...initState }
    case `${FETCH_REVENUE_CENTERS}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_REVENUE_CENTERS}/fulfilled`:
      return {
        ...state,
        revenueCenters: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${FETCH_REVENUE_CENTERS}/rejected`:
      return { ...state, error: action.payload }
    default:
      return state
  }
}
