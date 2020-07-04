const initState = {
  auth: null,
  profile: null,
  loading: 'idle',
  error: null,
}

const NAME = 'customer'

export const RESET_CUSTOMER = `${NAME}/resetCustomer`
// export const SET_CUSTOMER = `${NAME}/setCustomer`
export const LOGIN_CUSTOMER = `${NAME}/loginCustomer`
export const LOGOUT_CUSTOMER = `${NAME}/logoutCustomer`
export const FETCH_CUSTOMER = `${NAME}/fetchCustomer`
export const UPDATE_CUSTOMER = `${NAME}/updateCustomer`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_CUSTOMER:
      return { ...initState }
    // case SET_CUSTOMER:
    //   return { ...state, ...action.payload }
    case `${LOGIN_CUSTOMER}/pending`:
      return { ...state, loading: 'pending' }
    case `${LOGIN_CUSTOMER}/fulfilled`:
      return {
        ...state,
        auth: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${LOGIN_CUSTOMER}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    case `${LOGOUT_CUSTOMER}/pending`:
      return { ...state, loading: 'pending' }
    case `${LOGOUT_CUSTOMER}/fulfilled`:
      return { ...initState }
    case `${LOGOUT_CUSTOMER}/rejected`:
      return { ...initState }
    case `${FETCH_CUSTOMER}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_CUSTOMER}/fulfilled`:
      return {
        ...state,
        profile: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${FETCH_CUSTOMER}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    case `${UPDATE_CUSTOMER}/pending`:
      return { ...state, loading: 'pending' }
    case `${UPDATE_CUSTOMER}/fulfilled`:
      return {
        ...state,
        profile: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${UPDATE_CUSTOMER}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    default:
      return state
  }
}
