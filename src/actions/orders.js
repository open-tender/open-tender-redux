import { makeOrdersCounts } from '@open-tender/js'
import { pending, fulfill, reject } from '../utils'
import {
  SET_CURRENT_ORDER,
  RESET_ORDERS,
  FETCH_ORDERS,
  UPDATE_ORDER,
  PRINT_TICKET,
  UPDATE_TICKET,
  PRINT_TICKETS,
  RESET_TICKETS,
  UPDATE_ORDER_PREP,
  PRINT_RECEIPT,
} from '../reducers/orders'
import { addAlert } from './alerts'

// action creators

export const resetOrders = () => ({ type: RESET_ORDERS })
export const setCurrentOrder = order => ({
  type: SET_CURRENT_ORDER,
  payload: order,
})
export const updateOrder = (order, itemTypes) => ({
  type: UPDATE_ORDER,
  payload: { order, itemTypes },
})
export const skipFetchOrders = () => ({ type: `${FETCH_ORDERS}/skipped` })

// async action creators

export const fetchOrders = args => async (dispatch, getState) => {
  const { api, itemTypes } = getState().config
  if (!api) return
  const { loading, skipped } = getState().data.orders
  if (loading === 'pending' && skipped < 3) {
    return dispatch(skipFetchOrders())
  }
  dispatch(pending(FETCH_ORDERS))
  try {
    const orders = await api.getOrders(args)
    const counts = makeOrdersCounts(itemTypes, orders)
    dispatch(fulfill(FETCH_ORDERS, { orders, counts }))
  } catch (err) {
    dispatch(addAlert(err.detail || err.message))
    dispatch(reject(FETCH_ORDERS))
  }
}

export const printTicket = (order_uuid, ticket_no, status) => async (
  dispatch,
  getState
) => {
  const { api, itemTypes } = getState().config
  if (!api) return
  dispatch(pending(PRINT_TICKET))
  try {
    const data = status ? { ticket_status: status } : {}
    const order = await api.postTicketPrint(order_uuid, ticket_no, data)
    dispatch(updateOrder(order, itemTypes))
    dispatch(fulfill(PRINT_TICKET))
  } catch (err) {
    dispatch(addAlert(err.detail || err.message))
    dispatch(reject(PRINT_TICKET))
  }
}

export const updateTicket = (order_uuid, ticket_no, status) => async (
  dispatch,
  getState
) => {
  const { api, itemTypes } = getState().config
  if (!api) return
  dispatch(pending(UPDATE_TICKET))
  try {
    const order = await api.postTicketStatus(order_uuid, ticket_no, status)
    dispatch(updateOrder(order, itemTypes))
    dispatch(fulfill(UPDATE_TICKET))
  } catch (err) {
    dispatch(addAlert(err.detail || err.message))
    dispatch(reject(UPDATE_TICKET))
  }
}

export const printTickets = (order_uuid, status) => async (
  dispatch,
  getState
) => {
  const { api, itemTypes } = getState().config
  if (!api) return
  dispatch(pending(PRINT_TICKETS))
  try {
    const data = status ? { prep_status: status } : {}
    const order = await api.postTicketsPrint(order_uuid, data)
    dispatch(updateOrder(order, itemTypes))
    dispatch(fulfill(PRINT_TICKETS))
  } catch (err) {
    dispatch(addAlert(err.detail || err.message))
    dispatch(reject(PRINT_TICKETS))
  }
}

export const resetTickets = order_uuid => async (dispatch, getState) => {
  const { api, itemTypes } = getState().config
  if (!api) return
  dispatch(pending(RESET_TICKETS))
  try {
    const order = await api.postTicketsReset(order_uuid)
    dispatch(updateOrder(order, itemTypes))
    dispatch(fulfill(RESET_TICKETS))
  } catch (err) {
    dispatch(addAlert(err.detail || err.message))
    dispatch(reject(RESET_TICKETS))
  }
}

export const updateOrderPrep = (order_uuid, data) => async (
  dispatch,
  getState
) => {
  const { api, itemTypes } = getState().config
  if (!api) return
  dispatch(pending(UPDATE_ORDER_PREP))
  try {
    const order = await api.patchOrder(order_uuid, data)
    dispatch(updateOrder(order, itemTypes))
    dispatch(fulfill(UPDATE_ORDER_PREP))
  } catch (err) {
    dispatch(addAlert(err.detail || err.message))
    dispatch(reject(UPDATE_ORDER_PREP))
  }
}

export const printReceipt = order_uuid => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(PRINT_RECEIPT))
  try {
    await api.postReceipt(order_uuid)
    dispatch(fulfill(PRINT_RECEIPT))
  } catch (err) {
    dispatch(addAlert(err.detail || err.message))
    dispatch(reject(PRINT_RECEIPT))
  }
}
