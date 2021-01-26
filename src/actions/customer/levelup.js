import { makeFormErrors } from '@open-tender/js'
import { pending, fulfill, reject, MISSING_CUSTOMER } from '../../utils'
import { name, entity } from '../../reducers/customer/levelup'
import { selectToken } from '../../selectors/customer'
import { showNotification } from '../notifications'
import { checkAuth } from './account'

// action creators

export const resetCustomerLevelUp = () => ({
  type: `${name}/reset${entity}`,
})
export const resetCustomerLevelUpError = () => ({
  type: `${name}/reset${entity}Error`,
})
export const setCustomerLevelUp = levelup => ({
  type: `${name}/set${entity}`,
  payload: levelup,
})

// async action creators

export const fetchCustomerLevelUp = () => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token)
    return dispatch(reject(`${name}/fetch${entity}`, MISSING_CUSTOMER))
  dispatch(pending(`${name}/fetch${entity}`))
  try {
    const levelup = await api.getCustomerLevelUp(token)
    dispatch(fulfill(`${name}/fetch${entity}`, levelup))
  } catch (err) {
    dispatch(checkAuth(err, () => reject(`${name}/fetch${entity}`, err)))
  }
}

export const removeCustomerLevelUp = (levelupConnectId, callback) => async (
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
    await api.deleteCustomerLevelUp(token, levelupConnectId)
    dispatch(fulfill(`${name}/remove${entity}`, []))
    dispatch(showNotification('LevelUp disconnected!'))
    if (callback) callback()
  } catch (err) {
    dispatch(checkAuth(err, () => reject(`${name}/remove${entity}`, err)))
  }
}

export const addCustomerLevelUp = (data, callback) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token) return dispatch(reject(`${name}/add${entity}`, MISSING_CUSTOMER))
  dispatch(pending(`${name}/add${entity}`))
  try {
    const response = await api.postCustomerLevelUp(token, data)
    dispatch(fulfill(`${name}/add${entity}`, [response]))
    dispatch(showNotification('LevelUp connected!'))
    if (callback) callback()
  } catch (err) {
    const errors = makeFormErrors(err)
    dispatch(checkAuth(err, () => reject(`${name}/add${entity}`, errors)))
  }
}
