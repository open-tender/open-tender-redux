const initState = {
  allergens: [],
  selectedAllergens: null,
  loading: 'idle',
  error: null,
}

const NAME = 'allergens'

export const RESET_ALLERGENS = `${NAME}/resetAllergens`
export const FETCH_ALLERGENS = `${NAME}/fetchAllergens`
export const SET_SELECTED_ALLERGENS = `${NAME}/setSelectedAllergens`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_ALLERGENS:
      return { ...initState }
    case SET_SELECTED_ALLERGENS:
      return { ...state, selectedAllergens: action.payload }
    case `${FETCH_ALLERGENS}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_ALLERGENS}/fulfilled`:
      return {
        ...state,
        allergens: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${FETCH_ALLERGENS}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    default:
      return state
  }
}
