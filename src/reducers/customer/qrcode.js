const initState = {
  qrcode: null,
  loading: 'idle',
  error: null,
}

const NAME = 'thanx'

export const RESET_CUSTOMER_QRCODE = `${NAME}/resetCustomerQRCode`
export const FETCH_CUSTOMER_QRCODE = `${NAME}/fetchCustomerQRCode`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_CUSTOMER_QRCODE:
      return { ...initState }

    case `${FETCH_CUSTOMER_QRCODE}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_CUSTOMER_QRCODE}/fulfilled`:
      return {
        qrcode: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${FETCH_CUSTOMER_QRCODE}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }

    default:
      return state
  }
}
