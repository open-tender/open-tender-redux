const initState = {
  entities: [],
  loading: 'idle',
  error: null,
}

const NAME = 'completedOrders'

export const RESET_COMPLETED_ORDERS = `${NAME}/resetCompletedOrders`
export const FETCH_COMPLETED_ORDERS = `${NAME}/fetchCompletedOrders`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_COMPLETED_ORDERS:
      return { ...initState }
    case `${FETCH_COMPLETED_ORDERS}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_COMPLETED_ORDERS}/fulfilled`:
      return {
        ...state,
        entities: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${FETCH_COMPLETED_ORDERS}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    default:
      return state
  }
}
