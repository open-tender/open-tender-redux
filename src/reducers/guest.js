const initState = {
  loading: 'idle',
  errors: null,
  email: null,
  brands: null,
  showMagicLink: false,
}

const NAME = 'guest'

export const RESET_GUEST = `${NAME}/resetGuest`
export const RESET_GUEST_ERRORS = `${NAME}/resetGuestErrors`
export const SET_GUEST_EMAIL = `${NAME}/setGuestEmail`
export const FETCH_GUEST = `${NAME}/fetchGuest`
export const FETCH_GUEST_THANX = `${NAME}/fetchGuestThanx`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_GUEST:
      return { ...initState }
    case RESET_GUEST_ERRORS:
      return { ...state, loading: 'idle', errors: null, showMagicLink: false }
    case SET_GUEST_EMAIL:
      return { ...state, email: action.payload }

    case `${FETCH_GUEST}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_GUEST}/fulfilled`:
      return { ...state, loading: 'idle', errors: null, ...action.payload }
    case `${FETCH_GUEST}/rejected`:
      return {
        ...state,
        loading: 'idle',
        brands: null,
        ...action.payload,
      }

    case `${FETCH_GUEST_THANX}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_GUEST_THANX}/fulfilled`:
      return {
        ...state,
        loading: 'idle',
        errors: null,
        showMagicLink: true,
        ...action.payload,
      }
    case `${FETCH_GUEST_THANX}/rejected`:
      return {
        ...state,
        loading: 'idle',
        brands: null,
        showMagicLink: false,
        ...action.payload,
      }

    default:
      return state
  }
}
