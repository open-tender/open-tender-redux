const initState = {
  entities: [],
  loading: 'idle',
  error: null,
}

const NAME = 'menuItems'

export const RESET_MENU_ITEMS = `${NAME}/resetMenuItems`
export const SET_MENU_ITEMS = `${NAME}/setMenuItems`
export const FETCH_MENU_ITEMS = `${NAME}/fetchMenuItems`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_MENU_ITEMS:
      return { ...initState }
    case SET_MENU_ITEMS:
      return { ...state, entities: action.payload }
    case `${FETCH_MENU_ITEMS}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_MENU_ITEMS}/fulfilled`:
      return {
        ...state,
        entities: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${FETCH_MENU_ITEMS}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    default:
      return state
  }
}
