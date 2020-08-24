const initState = {
  entities: [],
  loading: 'idle',
  error: null,
}

const NAME = 'menuPages'

export const RESET_MENU_PAGES = `${NAME}/resetMenuPages`
export const SET_MENU_PAGES = `${NAME}/setMenuPages`
export const FETCH_MENU_PAGES = `${NAME}/fetchMenuPages`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_MENU_PAGES:
      return { ...initState }
    case SET_MENU_PAGES:
      return { ...state, entities: action.payload }
    case `${FETCH_MENU_PAGES}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_MENU_PAGES}/fulfilled`:
      return {
        ...state,
        entities: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${FETCH_MENU_PAGES}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    default:
      return state
  }
}
