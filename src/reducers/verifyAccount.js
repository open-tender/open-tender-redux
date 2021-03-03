const initState = {
  success: false,
  loading: 'idle',
  error: null,
}

const NAME = 'verifyAccount'

export const RESET_VERIFY_ACCOUNT = `${NAME}/resetVerifyAccount`
export const VERIFY_ACCOUNT = `${NAME}/verifyAccount`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_VERIFY_ACCOUNT:
      return { ...initState }

    case `${VERIFY_ACCOUNT}/pending`:
      return { ...state, loading: 'pending' }
    case `${VERIFY_ACCOUNT}/fulfilled`:
      return {
        ...state,
        success: true,
        loading: 'idle',
        error: null,
      }
    case `${VERIFY_ACCOUNT}/rejected`:
      return {
        ...state,
        success: false,
        loading: 'idle',
        error: action.payload,
      }
    default:
      return state
  }
}
