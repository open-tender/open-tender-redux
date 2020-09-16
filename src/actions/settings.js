import { pending, fulfill, reject } from '../utils'
import { RESET_SETTINGS, UPDATE_SETTINGS } from '../reducers/settings'

export const resetSettings = () => ({ type: RESET_SETTINGS })

export const updateSetting = entityType => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(UPDATE_SETTINGS))
  try {
    await api.postSettings(entityType)
    dispatch(fulfill(UPDATE_SETTINGS))
  } catch (err) {
    dispatch(reject(UPDATE_SETTINGS, err))
  }
}

export const updateSettings = entityTypes => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(UPDATE_SETTINGS))
  try {
    Promise.all(
      entityTypes.forEach(async entityType => {
        await api.postSettings(entityType)
      })
    )
    dispatch(fulfill(UPDATE_SETTINGS))
  } catch (err) {
    dispatch(reject(UPDATE_SETTINGS, err))
  }
}
