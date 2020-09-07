const initState = {
  entities: [],
  loading: 'idle',
  error: null,
}

const NAME = 'orders'

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

    case UPDATE_ORDER: {
      const entities = state.entities.map(i => {
        return i.order_uuid === action.payload.order_uuid ? action.payload : i
      })
      return { ...state, entities }
    }

    // fetchOrders
    case `${FETCH_ORDERS}/pending`:
      return { ...state, loading: 'pending' }
    case `${FETCH_ORDERS}/fulfilled`:
      return {
        ...state,
        entities: action.payload,
        loading: 'idle',
        error: null,
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
