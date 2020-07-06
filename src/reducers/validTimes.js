const initState = {
  entity: null,
  loading: 'idle',
  error: null,
}

const NAME = 'validTimes'

export const RESET_VALID_TIMES = `${NAME}/resetValidTimes`
export const SET_VALID_TIMES = `${NAME}/setValidTimes`
export const FETCH_VALID_TIMES = `${NAME}/fetchValidTimes`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_VALID_TIMES:
      return { ...initState }
    case SET_VALID_TIMES:
      return { ...state, entity: action.payload }
    case `${FETCH_VALID_TIMES}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_VALID_TIMES}/fulfilled`:
      return {
        ...state,
        entity: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${FETCH_VALID_TIMES}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    default:
      return state
  }
}
