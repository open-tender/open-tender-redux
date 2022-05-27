import { makeFormErrors } from '@open-tender/js'
import { pending, fulfill, reject, MISSING_CUSTOMER } from '../../utils'
import { name, entity } from '../../reducers/customer/communicationPreferences'
import { selectToken } from '../../selectors/customer'
import { showNotification } from '../notifications'
import { checkAuth } from './account'

// action creators

export const resetCustomerCommunicationPreferences = () => ({
  type: `${name}/reset${entity}`,
})
export const resetCustomerCommunicationPreferencesError = () => ({
  type: `${name}/reset${entity}Error`,
})
export const setCustomerCommunicationPreferences =
  communicationPreferences => ({
    type: `${name}/set${entity}`,
    payload: communicationPreferences,
  })

// async action creators

export const fetchCustomerCommunicationPreferences =
  () => async (dispatch, getState) => {
    const { api } = getState().config
    if (!api) return
    const token = selectToken(getState())
    if (!token)
      return dispatch(reject(`${name}/fetch${entity}`, MISSING_CUSTOMER))
    dispatch(pending(`${name}/fetch${entity}`))
    try {
      const { data: communicationPreferences } =
        await api.getCustomerCommunicationPreferences(token)
      dispatch(fulfill(`${name}/fetch${entity}`, communicationPreferences))
    } catch (err) {
      dispatch(checkAuth(err, () => reject(`${name}/fetch${entity}`, err)))
    }
  }

export const addCustomerCommunicationPreference =
  (area, channel, callback) => async (dispatch, getState) => {
    const { api } = getState().config
    if (!api) return
    const token = selectToken(getState())
    if (!token)
      return dispatch(reject(`${name}/add${entity}`, MISSING_CUSTOMER))
    dispatch(pending(`${name}/add${entity}`))
    try {
      const data = { notification_area: area, notification_channel: channel }
      await api.postCustomerCommunicationPreference(token, data)
      const { data: communicationPreferences } =
        await api.getCustomerCommunicationPreferences(token)
      dispatch(fulfill(`${name}/add${entity}`, communicationPreferences))
      dispatch(showNotification('Preference added!'))
      if (callback) callback()
    } catch (err) {
      const errors = makeFormErrors(err)
      dispatch(checkAuth(err, () => reject(`${name}/add${entity}`, errors)))
    }
  }

export const removeCustomerCommunicationPreference =
  (prefId, callback) => async (dispatch, getState) => {
    const { api } = getState().config
    if (!api) return
    const token = selectToken(getState())
    if (!token)
      return dispatch(reject(`${name}/remove${entity}`, MISSING_CUSTOMER))
    dispatch(pending(`${name}/remove${entity}`))
    try {
      await api.deleteCustomerCommunicationPreference(token, prefId)
      const { data: communicationPreferences } =
        await api.getCustomerCommunicationPreferences(token)
      dispatch(fulfill(`${name}/remove${entity}`, communicationPreferences))
      dispatch(showNotification('Preference removed!'))
      if (callback) callback()
    } catch (err) {
      dispatch(checkAuth(err, () => reject(`${name}/remove${entity}`, err)))
    }
  }

export const setCustomerCommunicationDefaultPreferences =
  prefs => async (dispatch, getState) => {
    const { api } = getState().config
    if (!api) return
    const token = selectToken(getState())
    if (!token)
      return dispatch(reject(`${name}/add${entity}`, MISSING_CUSTOMER))
    dispatch(pending(`${name}/add${entity}`))
    try {
      await api.putCustomerCommunicationPreference(token, prefs)
      const { data: communicationPreferences } =
        await api.getCustomerCommunicationPreferences(token)
      dispatch(fulfill(`${name}/add${entity}`, communicationPreferences))
    } catch (err) {
      const errors = makeFormErrors(err)
      dispatch(checkAuth(err, () => reject(`${name}/add${entity}`, errors)))
    }
  }
