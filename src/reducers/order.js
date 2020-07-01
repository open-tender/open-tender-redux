const initState = {
  orderId: null,
  orderType: null,
  serviceType: null,
  isOutpost: false,
  revenueCenter: null,
  requestedAt: 'asap',
  address: null,
  currentItem: null,
  cart: [],
  cartCounts: {},
  messages: [],
  error: null,
  loading: 'idle',
}

const NAME = 'order'

export const RESET_ORDER = `${NAME}/resetOrder`
export const RESET_ORDER_TYPE = `${NAME}/resetOrderType`

export const SET_ORDER_TYPE = `${NAME}/setOrderType`
export const SET_SERVICE_TYPE = `${NAME}/setServiceType`
export const SET_ORDER_SERVICE_TYPE = `${NAME}/setOrderServiceType`
export const SET_REVENUE_CENTER = `${NAME}/setRevenueCenter`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_ORDER:
      return { ...initState }
    case RESET_ORDER_TYPE:
      return {
        ...state,
        orderId: null,
        orderType: null,
        serviceType: null,
        isOutpost: null,
        revenueCenter: null,
        requestedAt: null,
      }
    case SET_ORDER_TYPE:
      return { ...state, orderType: action.payload }
    case SET_SERVICE_TYPE:
      return { ...state, serviceType: action.payload }
    case SET_ORDER_SERVICE_TYPE:
      return { ...state, ...action.payload }
    case SET_REVENUE_CENTER:
      return { ...state, revenueCenter: action.payload }
    default:
      return state
  }
}
