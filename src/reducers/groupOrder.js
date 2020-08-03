const initState = {
  token: null,
  cartId: null,
  isCartOwner: false,
  cartOwnerName: null,
  cartGuestId: null,
  closed: false,
  error: null,
  loading: 'idle',
}

const NAME = 'groupOrder'

export const RESET_GROUP_ORDER = `${NAME}/resetGroupOrder`
export const SHARE_CART = `${NAME}/shareCart`
export const FETCH_GROUP_ORDER = `${NAME}/fetchGroupOrder`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_GROUP_ORDER:
      return { ...initState }
    case `${SHARE_CART}/pending`:
      return { ...state, loading: 'pending' }
    case `${SHARE_CART}/fulfilled`:
      return {
        ...state,
        ...action.payload,
        loading: 'idle',
        error: null,
      }
    case `${SHARE_CART}/rejected`:
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
