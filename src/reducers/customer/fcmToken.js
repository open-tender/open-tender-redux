const initState = {
  loading: 'idle',
  error: null,
}

const NAME = 'fcmToken'

export const RESET_CUSTOMER_FCM_TOKEN = `${NAME}/resetCustomerFcmToken`
export const FETCH_CUSTOMER_FCM_TOKEN = `${NAME}/fetchCustomerFcmToken`
export const ADD_CUSTOMER_FCM_TOKEN = `${NAME}/addCustomerFcmToken`
export const REMOVE_CUSTOMER_FCM_TOKEN = `${NAME}/removeCustomerFcmToken`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_CUSTOMER_FCM_TOKEN:
      return { ...initState }

    case `${ADD_CUSTOMER_FCM_TOKEN}/pending`:
      return { ...state, loading: 'pending' }
    case `${ADD_CUSTOMER_FCM_TOKEN}/fulfilled`:
      return {
        loading: 'idle',
        error: null,
      }
    case `${ADD_CUSTOMER_FCM_TOKEN}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }

    case `${FETCH_CUSTOMER_FCM_TOKEN}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_CUSTOMER_FCM_TOKEN}/fulfilled`:
      return {
        loading: 'idle',
        error: null,
      }
    case `${FETCH_CUSTOMER_FCM_TOKEN}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }

    case `${REMOVE_CUSTOMER_FCM_TOKEN}/pending`:
      return { ...state, loading: 'pending' }
    case `${REMOVE_CUSTOMER_FCM_TOKEN}/fulfilled`:
      return {
        loading: 'idle',
        error: null,
      }
    case `${REMOVE_CUSTOMER_FCM_TOKEN}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }

    default:
      return state
  }
}
