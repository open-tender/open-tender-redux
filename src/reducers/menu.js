const initState = {
  menuVars: null,
  previousMenuVars: null,
  categories: [],
  soldOut: [],
  cartErrors: null,
  error: null,
  loading: 'idle',
}

const NAME = 'menu'

export const RESET_MENU = `${NAME}/resetMenu`
export const RESET_MENU_VARS = `${NAME}/resetMenuVars`
export const RESET_CART_ERRORS = `${NAME}/resetCartErrors`
export const SET_CART_ERRORS = `${NAME}/setCartErrors`
export const FETCH_MENU = `${NAME}/fetchMenu`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_MENU:
      return { ...initState }
    case RESET_MENU_VARS:
      return { ...state, menuVars: null, previousMenuVars: null }
    case RESET_CART_ERRORS:
      return { ...state, cartErrors: null }
    case SET_CART_ERRORS:
      return { ...state, cartErrors: action.payload }
    case `${FETCH_MENU}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_MENU}/fulfilled`:
      return {
        ...state,
        previousMenuVars: state.menuVars || null,
        loading: 'idle',
        error: null,
        ...action.payload,
      }
    case `${FETCH_MENU}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    default:
      return state
  }
}
