const initState = {
  previous: null,
  refund: null,
  loading: 'idle',
  error: null,
  compeleted: false,
}

const NAME = 'refund'

export const RESET_REFUND = `${NAME}/resetRefund`
export const SET_REFUND = `${NAME}/setRefund`
export const FETCH_PREVIOUS_REFUNDS = `${NAME}/fetchPreviousRefunds`
export const VALIDATE_REFUND = `${NAME}/validateRefund`
export const SUBMIT_REFUND = `${NAME}/submitRefund`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_REFUND:
      return { ...initState }

    case SET_REFUND:
      return { ...state, refund: action.payload }

    case `${FETCH_PREVIOUS_REFUNDS}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_PREVIOUS_REFUNDS}/fulfilled`:
      return {
        ...state,
        previous: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${FETCH_PREVIOUS_REFUNDS}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }

    case `${VALIDATE_REFUND}/pending`:
      return { ...state, loading: 'pending' }
    case `${VALIDATE_REFUND}/fulfilled`:
      return {
        ...state,
        refund: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${VALIDATE_REFUND}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }

    case `${SUBMIT_REFUND}/pending`:
      return { ...state, loading: 'pending' }
    case `${SUBMIT_REFUND}/fulfilled`:
      return {
        ...state,
        refund: action.payload,
        loading: 'idle',
        error: null,
        compeleted: true,
      }
    case `${SUBMIT_REFUND}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }

    default:
      return state
  }
}
