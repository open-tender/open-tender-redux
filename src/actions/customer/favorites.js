import { makeFormErrors, makeFavoritesLookup } from 'open-tender-js'
import { pending, fulfill, reject, MISSING_CUSTOMER } from '../../utils'
import { name, entity } from '../../reducers/customer/favorites'
import { selectToken } from '../../selectors/customer'
import { showNotification } from '../notifications'

// action creators

export const resetCustomerFavorites = () => ({
  type: `${name}/reset${entity}`,
})
export const resetCustomerFavoritesError = () => ({
  type: `${name}/reset${entity}Error`,
})
export const setCustomerFavorites = favorites => ({
  type: `${name}/set${entity}`,
  payload: favorites,
})
export const setCustomerFavoritesLookup = lookup => ({
  type: `${name}/set${entity}Lookup`,
  payload: lookup,
})

// async action creators

export const fetchCustomerFavorites = () => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token)
    return dispatch(reject(`${name}/fetch${entity}`, MISSING_CUSTOMER))
  dispatch(pending(`${name}/fetch${entity}`))
  try {
    const { data: favorites } = await api.getCustomerFavorites(token)
    const lookup = makeFavoritesLookup(favorites)
    dispatch(setCustomerFavoritesLookup(lookup))
    dispatch(fulfill(`${name}/fetch${entity}`, favorites))
  } catch (err) {
    dispatch(reject(`${name}/fetch${entity}`, err))
  }
}

export const updateCustomerFavorite = (favoriteId, data, callback) => async (
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
    await api.putCustomerFavorite(token, favoriteId, data)
    const { data: favorites } = await api.getCustomerFavorites(token)
    const lookup = makeFavoritesLookup(favorites)
    dispatch(setCustomerFavoritesLookup(lookup))
    dispatch(fulfill(`${name}/update${entity}`, favorites))
    dispatch(showNotification('Favorite updated!'))
    if (callback) callback()
  } catch (err) {
    dispatch(reject(`${name}/update${entity}`, makeFormErrors(err)))
  }
}

export const removeCustomerFavorite = (favoriteId, callback) => async (
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
    await api.deleteCustomerFavorite(token, favoriteId)
    const { data: favorites } = await api.getCustomerFavorites(token)
    const lookup = makeFavoritesLookup(favorites)
    dispatch(setCustomerFavoritesLookup(lookup))
    dispatch(fulfill(`${name}/remove${entity}`, favorites))
    dispatch(showNotification('Favorite removed!'))
    if (callback) callback()
  } catch (err) {
    dispatch(reject(`${name}/remove${entity}`, err))
  }
}

export const addCustomerFavorite = (data, callback) => async (
  dispatch,
  getState
) => {
  const { api } = getState().config
  if (!api) return
  const token = selectToken(getState())
  if (!token) return dispatch(reject(`${name}/add${entity}`, MISSING_CUSTOMER))
  dispatch(pending(`${name}/add${entity}`))
  try {
    if (!data.name) data.name = ''
    await api.postCustomerFavorite(token, data)
    const { data: favorites } = await api.getCustomerFavorites(token)
    const lookup = makeFavoritesLookup(favorites)
    dispatch(setCustomerFavoritesLookup(lookup))
    dispatch(fulfill(`${name}/add${entity}`, favorites))
    dispatch(showNotification('Favorite added!'))
    if (callback) callback()
  } catch (err) {
    dispatch(reject(`${name}/add${entity}`, makeFormErrors(err)))
  }
}
