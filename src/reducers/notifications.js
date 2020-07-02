import { makeRandomNumberString } from 'open-tender-js'

const initState = []

const NAME = 'notifications'

export const SHOW_NOTIFICATION = `${NAME}/showNotification`
export const HIDE_NOTIFICATION = `${NAME}/hideNotification`

export default (state = initState, action) => {
  switch (action.type) {
    case SHOW_NOTIFICATION:
      return [
        ...state,
        { message: action.payload, id: makeRandomNumberString() },
      ]
    case HIDE_NOTIFICATION:
      return state.filter(i => i.id !== action.payload)
    default:
      return state
  }
}
