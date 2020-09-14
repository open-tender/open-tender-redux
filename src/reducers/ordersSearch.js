const initState = {
  entities: [],
  loading: 'idle',
  error: null,
}

const NAME = 'ordersSearch'

export const RESET_ORDERS_SEARCH = `${NAME}/resetOrdersSearch`
export const FETCH_ORDERS_SEARCH = `${NAME}/fetchOrdersSearch`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_ORDERS_SEARCH:
      return { ...initState }

    case `${FETCH_ORDERS_SEARCH}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_ORDERS_SEARCH}/fulfilled`:
      return {
        ...state,
        entities: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${FETCH_ORDERS_SEARCH}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    default:
      return state
  }
}
