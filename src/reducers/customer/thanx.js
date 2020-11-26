const initState = {
  thanx: null,
  loading: 'idle',
  error: null,
}

const NAME = 'thanx'

export const RESET_CUSTOMER_THANX = `${NAME}/resetCustomerThanx`
export const FETCH_CUSTOMER_THANX = `${NAME}/fetchCustomerThanx`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_CUSTOMER_THANX:
      return { ...initState }

    case `${FETCH_CUSTOMER_THANX}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_CUSTOMER_THANX}/fulfilled`:
      return {
        thanx: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${FETCH_CUSTOMER_THANX}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }

    default:
      return state
  }
}
