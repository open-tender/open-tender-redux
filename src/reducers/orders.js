import { parseIsoToDate, makeOrdersCounts } from '@open-tender/js'

const initState = {
  entities: [],
  loading: 'idle',
  error: null,
  currentOrder: null,
  counts: { current: null, future: null },
}

const NAME = 'orders'

export const SET_CURRENT_ORDER = `${NAME}/setCurrentOrder`
export const RESET_ORDERS = `${NAME}/resetOrders`
export const UPDATE_ORDER = `${NAME}/updateOrder`
export const FETCH_ORDERS = `${NAME}/fetchOrders`
export const PRINT_TICKET = `${NAME}/printTicket`
export const UPDATE_TICKET = `${NAME}/updateTicket`
export const PRINT_TICKETS = `${NAME}/printTickets`
export const RESET_TICKETS = `${NAME}/resetTickets`
export const UPDATE_ORDER_PREP = `${NAME}/updateOrderPrep`

export default (state = initState, action) => {
  switch (action.type) {
    case RESET_ORDERS:
      return { ...initState }

    case SET_CURRENT_ORDER:
      return { ...state, currentOrder: action.payload }

    case UPDATE_ORDER: {
      const { order, itemTypes } = action.payload
      const entities = state.entities
        .map(i => {
          return i.order_uuid === order.order_uuid ? order : i
        })
        .map(i => ({ ...i, fireAt: parseIsoToDate(i.fire_at) }))
        .sort((a, b) => a.fireAt - b.fireAt)
      const counts = makeOrdersCounts(itemTypes, entities)
      const currentOrder = state.currentOrder ? order : null
      return { ...state, entities, currentOrder, counts }
    }

    // fetchOrders
    case `${FETCH_ORDERS}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_ORDERS}/fulfilled`: {
      const { orders, counts } = action.payload
      return {
        ...state,
        entities: orders,
        counts,
        loading: 'idle',
        error: null,
      }
    }
    case `${FETCH_ORDERS}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }

    // printTicket
    case `${PRINT_TICKET}/pending`:
      return { ...state, loading: 'pending' }
    case `${PRINT_TICKET}/fulfilled`:
      return { ...state, loading: 'idle', error: null }
    case `${PRINT_TICKET}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }

    // updateTicket
    case `${UPDATE_TICKET}/pending`:
      return { ...state, loading: 'pending' }
    case `${UPDATE_TICKET}/fulfilled`:
      return { ...state, loading: 'idle', error: null }
    case `${UPDATE_TICKET}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }

    // printTickets
    case `${PRINT_TICKETS}/pending`:
      return { ...state, loading: 'pending' }
    case `${PRINT_TICKETS}/fulfilled`:
      return { ...state, loading: 'idle', error: null }
    case `${PRINT_TICKETS}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }

    // resetTickets
    case `${RESET_TICKETS}/pending`:
      return { ...state, loading: 'pending' }
    case `${RESET_TICKETS}/fulfilled`:
      return { ...state, loading: 'idle', error: null }
    case `${RESET_TICKETS}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }

    // updateOrderPrep
    case `${UPDATE_ORDER_PREP}/pending`:
      return { ...state, loading: 'pending' }
    case `${UPDATE_ORDER_PREP}/fulfilled`:
      return { ...state, loading: 'idle', error: null }
    case `${UPDATE_ORDER_PREP}/rejected`:
      return { ...state, loading: 'idle', error: action.payload }

    default:
      return state
  }
}
