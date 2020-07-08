import {
  isEmpty,
  contains,
  isString,
  getDefaultTip,
  prepareOrder,
  handleCheckoutErrors,
} from '@open-tender/js'
import { pending, fulfill, reject } from '../utils'
import {
  RESET_CHECKOUT,
  RESET_ERRORS,
  RESET_TIP,
  RESET_COMPLETED_ORDER,
  SET_SUBMITTING,
  UPDATE_FORM,
  UPDATE_CUSTOMER,
  VALIDATE_ORDER,
  SUBMIT_ORDER,
} from '../reducers/checkout'
import { refreshRevenueCenter, setAlert, resetAlert } from './order'
import { fetchMenu } from './menu'

// action creators

export const resetCheckout = () => ({ type: RESET_CHECKOUT })
export const resetErrors = () => ({ type: RESET_ERRORS })
export const resetTip = () => ({ type: RESET_TIP })
export const resetCompletedOrder = () => ({ type: RESET_COMPLETED_ORDER })
export const setSubmitting = bool => ({ type: SET_SUBMITTING, payload: bool })
export const updateForm = form => ({ type: UPDATE_FORM, payload: form })
export const updateCheckoutCustomer = account => ({
  type: UPDATE_CUSTOMER,
  payload: account,
})

// async action creators

const refreshKeys = ['revenue_center_id', 'service_type', 'requested_at']

const makeRefreshArgs = order => ({
  revenueCenterId: order.revenue_center_id,
  serviceType: order.service_type,
  requestedAt: order.requested_at,
})

export const validateOrder = order => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(VALIDATE_ORDER))
  try {
    const check = await api.postOrderValidate(order)
    const errMessages = handleCheckoutErrors({ params: check.errors })
    let errors = {}
    const keys = Object.keys(errMessages)
    const args = makeRefreshArgs(order)
    if (contains(keys, refreshKeys)) {
      dispatch(refreshRevenueCenter(args))
    } else if (contains(keys, ['cart'])) {
      const cartError = errMessages.cart
      if (isString(cartError)) {
        dispatch(fetchMenu(args))
      } else {
        const alert = { type: 'cartCounts', args: { errors: cartError } }
        dispatch(setAlert(alert))
      }
    } else if (contains(keys, ['promo_codes'])) {
      errors['promo_codes'] = errMessages.promo_codes
    }
    dispatch(fulfill(VALIDATE_ORDER, { check, errors }))
  } catch (err) {
    dispatch(reject(VALIDATE_ORDER, err))
  }
}

export const submitOrder = () => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(SUBMIT_ORDER))
  const alert = { type: 'working', args: { text: 'Submitting your order...' } }
  dispatch(setAlert(alert))
  // start order assembly
  const { order, checkout } = getState().data
  const { orderId, revenueCenter, serviceType, requestedAt, cart } = order
  const { revenue_center_id: revenueCenterId } = revenueCenter || {}
  const { check, form } = checkout
  const {
    customer,
    address,
    details,
    surcharges,
    discounts,
    promoCodes,
    tenders,
    tip,
  } = form
  const defaultTip = check ? getDefaultTip(check.config) : null
  const fullAddress = { ...order.address, ...address }
  const data = {
    orderId,
    revenueCenterId,
    serviceType,
    requestedAt,
    cart,
    customer,
    address: isEmpty(fullAddress) ? null : fullAddress,
    details,
    surcharges,
    discounts,
    promoCodes,
    tip: tip === null ? defaultTip : tip,
    tenders,
  }
  const preparedOrder = prepareOrder(data)
  // end order assembly
  try {
    const completedOrder = await api.postOrder(preparedOrder)
    dispatch(setAlert({ type: 'close' }))
    dispatch(fulfill(SUBMIT_ORDER, completedOrder))
  } catch (err) {
    dispatch(setAlert({ type: 'close' }))
    const errors = handleCheckoutErrors(err)
    const keys = Object.keys(errors)
    const args = makeRefreshArgs(preparedOrder)
    if (contains(keys, refreshKeys)) {
      dispatch(refreshRevenueCenter(args))
      dispatch(reject(SUBMIT_ORDER, {}))
    } else if (contains(keys, ['cart'])) {
      const cartError = errors.cart
      if (isString(cartError)) {
        dispatch(fetchMenu(args))
      } else {
        const alert = { type: 'cartCounts', args: { errors: cartError } }
        dispatch(setAlert(alert))
      }
      dispatch(reject(SUBMIT_ORDER, {}))
    } else {
      window.scroll(0, 0)
      dispatch(reject(SUBMIT_ORDER, errors))
    }
  }
}
