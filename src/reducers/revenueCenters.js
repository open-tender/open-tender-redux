import { SET_REVENUE_CENTERS } from '../actions/revenueCenters'

const initState = {
  entities: [],
  loading: 'idle',
  error: null,
}

export default (state = initState, action) => {
  switch (action.type) {
    case SET_REVENUE_CENTERS:
      return { ...state, ...action.payload }
    default:
      return state
  }
}
