import { pending, fulfill, reject } from '../utils'
import {
  RESET_ORDERS,
  FETCH_ORDERS,
  UPDATE_ORDER,
  PRINT_TICKET,
  UPDATE_TICKET,
  PRINT_TICKETS,
  RESET_TICKETS,
  UPDATE_ORDER_PREP,
} from '../reducers/orders'

// action creators

export const resetOrders = () => ({ type: RESET_ORDERS })
export const updateOrder = order => ({ type: UPDATE_ORDER, payload: order })

// async action creators

export const fetchOrders = args => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(FETCH_ORDERS))
  try {
    // console.log('fetchOrders args:', args)
    const orders = await api.getOrders(args)
    dispatch(fulfill(FETCH_ORDERS, orders))
  } catch (err) {
    dispatch(reject(FETCH_ORDERS, err))
  }
}

export const printTicket = (order_uuid, ticket_no) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(PRINT_TICKET))
  try {
    const order = await api.postTicketPrint(order_uuid, ticket_no)
    dispatch(fulfill(PRINT_TICKET))
    dispatch(updateOrder(order))
  } catch (err) {
    const error = { ...err, form: err.detail || err.message }
    dispatch(reject(PRINT_TICKET, error))
  }
}

export const updateTicket = (order_uuid, ticket_no, status) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(UPDATE_TICKET))
  try {
    const order = await api.postTicketStatus(order_uuid, ticket_no, status)
    dispatch(fulfill(UPDATE_TICKET))
    dispatch(updateOrder(order))
  } catch (err) {
    const error = { ...err, form: err.detail || err.message }
    dispatch(reject(UPDATE_TICKET, error))
  }
}

export const printTickets = order_uuid => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(PRINT_TICKETS))
  try {
    const order = await api.postTicketsPrint(order_uuid)
    dispatch(fulfill(PRINT_TICKETS))
    dispatch(updateOrder(order))
  } catch (err) {
    const error = { ...err, form: err.detail || err.message }
    dispatch(reject(PRINT_TICKETS, error))
  }
}

export const resetTickets = order_uuid => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(RESET_TICKETS))
  try {
    const order = await api.postTicketsReset(order_uuid)
    dispatch(fulfill(RESET_TICKETS))
    dispatch(updateOrder(order))
  } catch (err) {
    const error = { ...err, form: err.detail || err.message }
    dispatch(reject(RESET_TICKETS, error))
  }
}

export const updateOrderPrep = (order_uuid, data) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(UPDATE_ORDER_PREP))
  try {
    const order = await api.patchOrder(order_uuid, data)
    console.log(order.expected_at)
    dispatch(fulfill(UPDATE_ORDER_PREP))
    dispatch(updateOrder(order))
  } catch (err) {
    const error = { ...err, form: err.detail || err.message }
    dispatch(reject(UPDATE_ORDER_PREP, error))
  }
}
