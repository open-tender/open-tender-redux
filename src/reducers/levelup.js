const initState = {
  loading: 'idle',
  error: null,
}

const NAME = 'levelup'

export const RESET_LEVELUP_CUSTOMER = `${NAME}/resetLevelUpCusotmer`
export const FETCH_LEVELUP_CUSTOMER = `${NAME}/fetchLevelUpCustomer`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_LEVELUP_CUSTOMER:
      return { ...initState }
    case `${FETCH_LEVELUP_CUSTOMER}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_LEVELUP_CUSTOMER}/fulfilled`:
      return { ...initState }
    case `${FETCH_LEVELUP_CUSTOMER}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    default:
      return state
  }
}
