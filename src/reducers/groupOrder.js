const initState = {
  cartId: null,
  token: null,
  revenueCenterId: null,
  serviceType: null,
  requestedAt: null,
  cutoffAt: null,
  guestLimit: null,
  guestCount: null,
  spendingLimit: null,
  closed: false,
  isCartOwner: false,
  cartOwner: null,
  cartGuest: null,
  error: null,
  loading: 'idle',
}

const NAME = 'groupOrder'

export const RESET_GROUP_ORDER = `${NAME}/resetGroupOrder`
export const START_GROUP_ORDER = `${NAME}/startGroupOrder`
export const FETCH_GROUP_ORDER = `${NAME}/fetchGroupOrder`
export const UPDATE_GROUP_ORDER = `${NAME}/updateGroupOrder`
export const DELETE_GROUP_ORDER = `${NAME}/deleteGroupOrder`
export const JOIN_GROUP_ORDER = `${NAME}/joinGroupOrder`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_GROUP_ORDER:
      return { ...initState }

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

    case `${UPDATE_GROUP_ORDER}/pending`:
      return { ...state, loading: 'pending' }
    case `${UPDATE_GROUP_ORDER}/fulfilled`:
      return {
        ...state,
        loading: 'idle',
        error: null,
      }
    case `${UPDATE_GROUP_ORDER}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }

    case `${DELETE_GROUP_ORDER}/pending`:
      return { ...state, loading: 'pending' }
    case `${DELETE_GROUP_ORDER}/fulfilled`:
      return { ...initState }
    case `${DELETE_GROUP_ORDER}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }

    case `${JOIN_GROUP_ORDER}/pending`:
      return { ...state, loading: 'pending' }
    case `${JOIN_GROUP_ORDER}/fulfilled`:
      return {
        ...state,
        cartGuest: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${JOIN_GROUP_ORDER}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }

    default:
      return state
  }
}
