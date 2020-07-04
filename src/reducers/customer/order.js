const initState = {
  entity: {},
  loading: 'idle',
  error: null,
}

const NAME = 'customer/order'

export const RESET_ORDER = `${NAME}/resetCustomerOrder`
export const SET_ORDER = `${NAME}/setCustomerOrder`
export const FETCH_ORDER = `${NAME}/fetchCustomerOrder`
export const UPDATE_ORDER_RATING = `${NAME}/updateOrderRating`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_ORDER:
      return { ...initState }
    case SET_ORDER:
      return { ...state, entity: action.payload }
    case `${FETCH_ORDER}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_ORDER}/fulfilled`:
      return {
        ...state,
        entity: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${FETCH_ORDER}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    default:
      return state
  }
}
