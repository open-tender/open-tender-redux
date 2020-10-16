const initState = {
  orderFulfillment: null,
  loading: 'idle',
  error: null,
}

const NAME = 'orderFulfillment'

export const RESET_FULFILLMENT = `${NAME}/resetCustomer`
export const FETCH_FULFILLMENT = `${NAME}/fetchCustomer`
export const UPDATE_FULFILLMENT = `${NAME}/updateCustomer`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_FULFILLMENT:
      return { ...initState }

    case `${FETCH_FULFILLMENT}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_FULFILLMENT}/fulfilled`:
      return {
        orderFulfillment: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${FETCH_FULFILLMENT}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }

    case `${UPDATE_FULFILLMENT}/pending`:
      return { ...state, loading: 'pending' }
    case `${UPDATE_FULFILLMENT}/fulfilled`:
      return {
        orderFulfillment: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${UPDATE_FULFILLMENT}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }

    default:
      return state
  }
}
