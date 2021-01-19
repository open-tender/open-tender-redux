const initState = {
  entity: {},
  loading: 'idle',
  error: null,
}

const NAME = 'customer/order'

export const RESET_CUSTOMER_ORDER = `${NAME}/resetCustomerOrder`
export const SET_CUSTOMER_ORDER = `${NAME}/setCustomerOrder`
export const FETCH_CUSTOMER_ORDER = `${NAME}/fetchCustomerOrder`
export const UPDATE_CUSTOMER_ORDER_RATING = `${NAME}/updateCustomerOrderRating`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_CUSTOMER_ORDER:
      return { ...initState }
    case SET_CUSTOMER_ORDER:
      return { ...state, entity: action.payload }
    case `${FETCH_CUSTOMER_ORDER}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_CUSTOMER_ORDER}/fulfilled`:
      return {
        ...state,
        entity: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${FETCH_CUSTOMER_ORDER}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    default:
      return state
  }
}
