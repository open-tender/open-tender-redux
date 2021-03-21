const initState = {
  categories: [],
  loading: 'idle',
  error: null,
}

const NAME = 'menuDisplay'

export const RESET_MENU_DISPLAY = `${NAME}/resetMenuDisplay`
export const SET_MENU_DISPLAY = `${NAME}/setMenuDisplay`
export const FETCH_MENU_DISPLAY = `${NAME}/fetchMenuDisplay`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_MENU_DISPLAY:
      return { ...initState }
    case SET_MENU_DISPLAY:
      return { ...state, categories: action.payload }

    // fetch display menu
    case `${FETCH_MENU_DISPLAY}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_MENU_DISPLAY}/fulfilled`:
      return {
        ...state,
        categories: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${FETCH_MENU_DISPLAY}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }

    default:
      return state
  }
}
