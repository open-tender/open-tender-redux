import {
  addItem,
  removeItem,
  incrementItem,
  decrementItem,
  calcCartCounts,
  timezoneMap,
  makeFirstRequestedAt,
  makeRequestedAtStr,
  makeRandomNumberString,
} from '@open-tender/js'

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
  alert: null,
  error: null,
  loading: 'idle',
}

const NAME = 'order'

export const RESET_ORDER = `${NAME}/resetOrder`
export const RESET_ORDER_TYPE = `${NAME}/resetOrderType`
export const RESET_REVENUE_CENTER = `${NAME}/resetRevenueCenter`
export const RESET_CART = `${NAME}/resetCart`
export const RESET_MESSAGES = `${NAME}/resetMessages`
export const RESET_ALERT = `${NAME}/resetAlert`

export const UPDATE_ORDER = `${NAME}/updateOrder`
export const SET_ALERT = `${NAME}/setAlert`
export const SET_ORDER_ID = `${NAME}/setOrderId`
export const SET_ORDER_TYPE = `${NAME}/setOrderType`
export const SET_SERVICE_TYPE = `${NAME}/setServiceType`
export const SET_ORDER_SERVICE_TYPE = `${NAME}/setOrderServiceType`
export const SET_MENU_VARS = `${NAME}/setMenuVars`
export const SET_REVENUE_CENTER = `${NAME}/setRevenueCenter`
export const SET_ADDRESS = `${NAME}/setAddress`
export const SET_REQUESTED_AT = `${NAME}/setRequestedAt`
export const SET_CART = `${NAME}/setCart`
export const SET_CURRENT_ITEM = `${NAME}/setCurrentItem`
export const ADD_ITEM = `${NAME}/addItemToCart`
export const REMOVE_ITEM = `${NAME}/removeItemFromCart`
export const INCREMENT_ITEM = `${NAME}/incrementItemInCart`
export const DECREMENT_ITEM = `${NAME}/decrementItemInCart`
export const ADD_MESSAGE = `${NAME}/addMessage`
export const REMOVE_MESSAGE = `${NAME}/removeMessage`

export const FETCH_REVENUE_CENTER = `${NAME}/fetchRevenueCenter`
export const REVERT_MENU = `${NAME}/revertMenu`
export const REFRESH_REVENUE_CENTER = `${NAME}/refreshRevenueCenter`
export const EDIT_ORDER = `${NAME}/editOrder`
export const REORDER = `${NAME}/reorderPastOrder`
export const CHECKOUT = `${NAME}/checkout`

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
    case RESET_REVENUE_CENTER:
      return { ...state, revenueCenter: null }
    case RESET_CART:
      return {
        ...state,
        cart: [],
        cartCounts: {},
      }
    case RESET_MESSAGES:
      return { ...state, messages: [] }
    case RESET_ALERT:
      return { ...state, alert: null }
    case SET_ALERT:
      return { ...state, alert: action.payload }
    case ADD_MESSAGE:
      return {
        ...state,
        messages: [
          ...state.messages,
          {
            message: action.payload,
            id: makeRandomNumberString(),
          },
        ],
      }
    case REMOVE_MESSAGE:
      return {
        ...state,
        messages: state.messages.filter(i => i.id !== action.payload),
      }
    case UPDATE_ORDER:
      return { ...state, ...action.payload }
    case SET_ORDER_ID:
      return { ...state, orderId: action.payload }
    case SET_ORDER_TYPE:
      return { ...state, orderType: action.payload }
    case SET_SERVICE_TYPE:
      return { ...state, serviceType: action.payload }
    case SET_ORDER_SERVICE_TYPE:
      return { ...state, ...action.payload }
    case SET_MENU_VARS: {
      const { revenueCenter } = action.payload
      return {
        ...state,
        ...action.payload,
        orderType: revenueCenter.revenue_center_type,
        isOutpost: revenueCenter.is_outpost,
      }
    }
    case SET_ADDRESS:
      return { ...state, address: action.payload }
    case SET_REQUESTED_AT: {
      const messages = state.messages.filter(
        i => !i.message.includes('Requested time')
      )
      return { ...state, requestedAt: action.payload, messages }
    }
    case SET_REVENUE_CENTER: {
      const revenueCenter = action.payload
      const previousRequestedAt = state.requestedAt
      const requestedAt = makeFirstRequestedAt(
        revenueCenter,
        state.serviceType,
        previousRequestedAt
      )
      let messages
      if (previousRequestedAt && requestedAt !== previousRequestedAt) {
        const otherMessages = state.messages.filter(
          i => !i.message.includes('Requested time')
        )
        const tz = timezoneMap[revenueCenter.timezone]
        const requestedAtText = makeRequestedAtStr(requestedAt, tz)
        const msg = {
          message: `Requested time updated to ${requestedAtText}`,
          id: makeRandomNumberString(),
        }
        messages = [msg, ...otherMessages]
      } else {
        messages = state.messages
      }
      return { ...state, revenueCenter, requestedAt, messages }
    }
    case SET_CART: {
      const cartCounts = calcCartCounts(action.payload)
      return { ...state, cart: action.payload, cartCounts }
    }
    case SET_CURRENT_ITEM:
      return { ...state, currentItem: action.payload }
    case ADD_ITEM: {
      const { cart, cartCounts } = addItem([...state.cart], action.payload)
      return { ...state, cart, cartCounts }
    }
    case REMOVE_ITEM: {
      const { index } = action.payload
      const { cart, cartCounts } = removeItem([...state.cart], index)
      return { ...state, cart, cartCounts }
    }
    case INCREMENT_ITEM: {
      const { index } = action.payload
      const { cart, cartCounts } = incrementItem([...state.cart], index)
      return { ...state, cart, cartCounts }
    }
    case DECREMENT_ITEM: {
      const { index } = action.payload
      const { cart, cartCounts } = decrementItem([...state.cart], index)
      return { ...state, cart, cartCounts }
    }
    case `${FETCH_REVENUE_CENTER}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_REVENUE_CENTER}/fulfilled`:
      return {
        ...state,
        loading: 'idle',
        error: null,
      }
    case `${FETCH_REVENUE_CENTER}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    case `${REVERT_MENU}/pending`:
      return { ...state, loading: 'pending' }
    case `${REVERT_MENU}/fulfilled`:
      return {
        ...state,
        loading: 'idle',
        error: null,
      }
    case `${REVERT_MENU}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    case `${REFRESH_REVENUE_CENTER}/pending`:
      return { ...state, loading: 'pending' }
    case `${REFRESH_REVENUE_CENTER}/fulfilled`:
      return {
        ...state,
        alert: action.payload,
        loading: 'idle',
        error: null,
      }
    case `${REFRESH_REVENUE_CENTER}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    case `${EDIT_ORDER}/pending`:
      return { ...state, loading: 'pending' }
    case `${EDIT_ORDER}/fulfilled`:
      return {
        ...state,
        ...action.payload,
        loading: 'idle',
        error: null,
      }
    case `${EDIT_ORDER}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    case `${REORDER}/pending`:
      return { ...state, loading: 'pending' }
    case `${REORDER}/fulfilled`:
      return {
        ...state,
        ...action.payload,
        loading: 'idle',
        error: null,
      }
    case `${REORDER}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }
    case CHECKOUT:
      return state
    default:
      return state
  }
}
