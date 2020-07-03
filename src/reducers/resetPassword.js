const initState = {
  resetSent: false,
  success: false,
  loading: 'idle',
  error: null,
}

const NAME = 'resetPassword'

export const RESET_PASSWORD_RESET = `${NAME}/resetPasswordReset`
export const SEND_PASSWORD_RESET = `${NAME}/sendPasswordResetEmail`
export const RESET_PASSWORD = `${NAME}/resetPassword`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_PASSWORD_RESET:
      return { ...initState }
    case `${SEND_PASSWORD_RESET}/pending`:
      return { ...state, loading: 'pending' }
    case `${SEND_PASSWORD_RESET}/fulfilled`:
      return {
        ...state,
        resetSent: true,
        loading: 'idle',
        error: null,
      }
    case `${SEND_PASSWORD_RESET}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    case `${RESET_PASSWORD}/pending`:
      return { ...state, loading: 'pending' }
    case `${RESET_PASSWORD}/fulfilled`:
      return {
        ...state,
        resetSent: false,
        success: true,
        loading: 'idle',
        error: null,
      }
    case `${RESET_PASSWORD}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    default:
      return state
  }
}
