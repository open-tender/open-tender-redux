import { makeFormErrors } from '@open-tender/js'
import { pending, fulfill, reject, MISSING_CUSTOMER } from '../../utils'
import { name, entity } from '../../reducers/customer/addresses'
import { selectToken } from '../../selectors/customer'
import { showNotification } from '../notifications'
import { checkAuth } from './account'

// action creators

export const resetCustomerAddresses = () => ({ type: `${name}/reset${entity}` })
export const resetCustomerAddressesError = () => ({
  type: `${name}/reset${entity}Error`,
})
export const setCustomerAddresses = addresses => ({
  type: `${name}/set${entity}`,
  payload: addresses,
})

// async action creators

export const fetchCustomerAddresses = limit => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token)
    return dispatch(reject(`${name}/fetch${entity}`, MISSING_CUSTOMER))
  dispatch(pending(`${name}/fetch${entity}`))
  try {
    const { data: addresses } = await api.getCustomerAddresses(token, limit)
    dispatch(fulfill(`${name}/fetch${entity}`, addresses))
  } catch (err) {
    dispatch(checkAuth(err, () => reject(`${name}/fetch${entity}`, err)))
  }
}

export const updateCustomerAddress = (addressId, data, callback) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token)
    return dispatch(reject(`${name}/update${entity}`, MISSING_CUSTOMER))
  dispatch(pending(`${name}/update${entity}`))
  try {
    await api.putCustomerAddress(token, addressId, data)
    const limit = getState().data.customer.addresses.entities.length
    const { data: addresses } = await api.getCustomerAddresses(token, limit)
    dispatch(fulfill(`${name}/update${entity}`, addresses))
    dispatch(showNotification('Address updated!'))
    if (callback) callback()
  } catch (err) {
    const errors = makeFormErrors(err)
    dispatch(checkAuth(err, () => reject(`${name}/update${entity}`, errors)))
  }
}

export const removeCustomerAddress = (addressId, callback) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token)
    return dispatch(reject(`${name}/remove${entity}`, MISSING_CUSTOMER))
  dispatch(pending(`${name}/remove${entity}`))
  try {
    await api.deleteCustomerAddress(token, addressId)
    const limit = getState().data.customer.addresses.entities.length
    const { data: addresses } = await api.getCustomerAddresses(token, limit)
    dispatch(fulfill(`${name}/remove${entity}`, addresses))
    dispatch(showNotification('Address removed!'))
    if (callback) callback()
  } catch (err) {
    dispatch(checkAuth(err, () => reject(`${name}/remove${entity}`, err)))
  }
}
