const initState = {
  token: null,
  cartId: null,
  isCartOwner: false,
  cartOwnerName: null,
  cartGuestId: null,
  closed: false,
  firstIso: null,
  error: null,
  loading: 'idle',
}

const NAME = 'groupOrder'

export const RESET_GROUP_ORDER = `${NAME}/resetGroupOrder`
export const UPDATE_GROUP_ORDER = `${NAME}/updateGroupOrder`
export const START_GROUP_ORDER = `${NAME}/startGroupOrder`
export const FETCH_GROUP_ORDER = `${NAME}/fetchGroupOrder`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_GROUP_ORDER:
      return { ...initState }
    case UPDATE_GROUP_ORDER:
      return { ...state, ...action.payload }
    case `${START_GROUP_ORDER}/pending`:
      return { ...state, loading: 'pending' }
    case `${START_GROUP_ORDER}/fulfilled`:
      return {
        ...state,
        ...action.payload,
        loading: 'idle',
        error: null,
      }
    case `${START_GROUP_ORDER}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    case `${FETCH_GROUP_ORDER}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_GROUP_ORDER}/fulfilled`:
      return {
        ...state,
        ...action.payload,
        loading: 'idle',
        error: null,
      }
    case `${FETCH_GROUP_ORDER}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    default:
      return state
  }
}
