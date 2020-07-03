const initState = {
  order: null,
}

const NAME = 'confirmation'

export const RESET_CONFIRMATION = `${NAME}/resetConfirmation`
export const SET_CONFIRMATION_ORDER = `${NAME}/setConfirmationOrder`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_CONFIRMATION:
      return { ...initState }
    case SET_CONFIRMATION_ORDER:
      return { ...state, order: action.payload }
    default:
      return state
  }
}
