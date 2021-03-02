const initState = {
  entities: [],
  selected: null,
  loading: 'idle',
  error: null,
}

const NAME = 'deals'

export const RESET_DEALS = `${NAME}/resetDeals`
export const FETCH_DEALS = `${NAME}/fetchDeals`
export const SET_SELECTED_DEALS = `${NAME}/setSelectedDeals`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_DEALS:
      return { ...initState }
    case SET_SELECTED_DEALS:
      return { ...state, selected: action.payload }
    case `${FETCH_DEALS}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_DEALS}/fulfilled`:
      return {
        ...state,
        entities: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${FETCH_DEALS}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    default:
      return state
  }
}
