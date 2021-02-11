const initState = {
  orderRating: null,
  loading: 'idle',
  error: null,
}

const NAME = 'orderRating'

export const RESET_ORDER_RATING = `${NAME}/resetOrderRating`
export const FETCH_ORDER_RATING = `${NAME}/fetchOrderRating`
export const UPDATE_ORDER_RATING = `${NAME}/updateOrderRating`
export const UNSUBSCRIBE_ORDER_RATING = `${NAME}/unsubscribeOrderRating`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_ORDER_RATING:
      return { ...initState }

    case `${FETCH_ORDER_RATING}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_ORDER_RATING}/fulfilled`:
      return {
        orderRating: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${FETCH_ORDER_RATING}/rejected`:
      return {
        orderRating: null,
        loading: 'idle',
        error: action.payload,
      }

    case `${UPDATE_ORDER_RATING}/pending`:
      return { ...state, loading: 'pending' }
    case `${UPDATE_ORDER_RATING}/fulfilled`:
      return {
        orderRating: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${UPDATE_ORDER_RATING}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }

    case `${UNSUBSCRIBE_ORDER_RATING}/pending`:
      return { ...state, loading: 'pending' }
    case `${UNSUBSCRIBE_ORDER_RATING}/fulfilled`:
      return {
        ...state,
        orderRating: null,
        loading: 'idle',
        error: null,
      }
    case `${UNSUBSCRIBE_ORDER_RATING}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }

    default:
      return state
  }
}
