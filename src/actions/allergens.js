import { pending, fulfill, reject } from '../utils'
import { RESET_ALLERGENS, FETCH_ALLERGENS } from '../reducers/allergens'

// action creators

export const resetAllergens = () => ({ type: RESET_ALLERGENS })

// async action creators

export const fetchAllergens = () => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(FETCH_ALLERGENS))
  try {
    const allergens = await api.getAllergens()
    dispatch(fulfill(FETCH_ALLERGENS, allergens))
  } catch (err) {
    dispatch(reject(FETCH_ALLERGENS, err))
  }
}
