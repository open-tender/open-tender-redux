import { pending, fulfill, reject } from '../utils'
import {
  RESET_ALLERGENS,
  SET_SELECTED_ALLERGENS,
  FETCH_ALLERGENS,
} from '../reducers/allergens'

// action creators

export const resetAllergens = () => ({ type: RESET_ALLERGENS })
export const setSelectedAllergens = allergens => ({
  type: SET_SELECTED_ALLERGENS,
  payload: allergens,
})

// async action creators

export const fetchAllergens = () => async (dispatch, getState) => {
  const { api } = getState().config
  if (!api) return
  dispatch(pending(FETCH_ALLERGENS))
  try {
    const { data: allergens } = await api.getAllergens()
    dispatch(fulfill(FETCH_ALLERGENS, allergens))
  } catch (err) {
    dispatch(reject(FETCH_ALLERGENS, err))
  }
}
