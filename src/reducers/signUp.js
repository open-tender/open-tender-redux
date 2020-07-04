const initState = {
  loading: 'idle',
  error: null,
}

const NAME = 'signUp'

export const RESET_SIGN_UP = `${NAME}/resetSignUp`
export const SIGN_UP = `${NAME}/signUpCustomer`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_SIGN_UP:
      return { ...initState }
    case `${SIGN_UP}/pending`:
      return { ...state, loading: 'pending' }
    case `${SIGN_UP}/fulfilled`:
      return { ...initState }
    case `${SIGN_UP}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    default:
      return state
  }
}
