const initState = {
  loading: 'idle',
  error: null,
}

const NAME = 'settings'

export const RESET_SETTINGS = `${NAME}/resetSettings`
export const UPDATE_SETTINGS = `${NAME}/updateSettings`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_SETTINGS:
      return { ...initState }
    case `${UPDATE_SETTINGS}/pending`:
      return { ...state, loading: 'pending' }
    case `${UPDATE_SETTINGS}/fulfilled`:
      return { ...initState }
    case `${UPDATE_SETTINGS}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    default:
      return state
  }
}
